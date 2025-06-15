// src/supabase-functions/chat.ts

import { supabase } from "@/lib/supabaseClient"
import type { Tables } from "@/types/supabase"

// --- Types ------------------------------------------------

export type ChatRoom = Tables<"chat_rooms"> & {
  members?: { user_id: string | null }[]
}


export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

export interface RoomMember {
  user_id: string
  joined_at: string | null
  profile: Profile
}

// --- Chat Rooms -------------------------------------------

/**
 * Fetch all chat rooms the current user has joined (or created).
 */
export async function fetchUserChatRooms(): Promise<ChatRoom[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: memberships, error: mErr } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("user_id", user.id)

  if (mErr) {
    console.error("fetchUserChatRooms → memberships error:", mErr.message)
    return []
  }
  const roomIds = memberships?.map((m) => m.room_id ? m.room_id : "") ?? []

  const { data: rooms, error: rErr } = await supabase
    .from("chat_rooms")
    .select("*, members: room_members (user_id)")
    .in("id", roomIds)

  if (rErr) {
    console.error("fetchUserChatRooms → rooms error:", rErr.message)
    return []
  }
  return rooms
}

/**
 * Fetch all chat rooms
 */
export async function getAllRooms() {
  const {data, error} = await supabase
  .from("chat_rooms")
  .select("*")
  .eq("is_group", false)

  if (error) {
    console.error(error.message)
  }

  return data;
}

/**
 * Create a new group chat room and auto‑add the creator.
 */
export async function createChatRoom(
  roomName: string
): Promise<ChatRoom | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !roomName) return null

  const { data: room, error: cErr } = await supabase
    .from("chat_rooms")
    .insert({
      name: roomName,
      is_group: true,
      created_by: user.id,
    })
    .select("*")
    .single()

  if (cErr || !room) {
    console.error("createChatRoom error:", cErr?.message)
    return null
  }

  const { error: mErr } = await supabase
    .from("room_members")
    .insert({
      room_id: room.id,
      user_id: user.id,
      joined_at: new Date().toISOString(),
    })

  if (mErr) console.error("createChatRoom → room_members error:", mErr.message)

  return room
}


export async function getOrCreateOneToOneRoom(userBId: string) {
  const user = (await supabase.auth.getUser()).data.user
  const userAId = user?.id

  if(userAId === userBId) {
    const {data, error} = await supabase.from("chat_rooms").select("id").eq("created_by", userAId).eq("is_group", false)

    if (error) {
        console.error(error.message);
        return ""
    }

    console.log(data);
    
    return data;
  }

  if (!userAId || !userBId) throw new Error("Invalid user IDs")

  // 1. Get all room memberships for both users
  const { data: memberships, error } = await supabase
    .from("room_members")
    .select("room_id, user_id, chat_rooms(is_group)")
    .in("user_id", [userAId, userBId])

  if (error) throw error

  // 2. Group memberships by room_id
  const roomMap = new Map()

  for (const row of memberships) {
    if (!row.chat_rooms?.is_group) {
      if (!roomMap.has(row.room_id)) roomMap.set(row.room_id, [])
      roomMap.get(row.room_id).push(row.user_id)
    }
  }

  // 3. Look for a room with exactly both users
  for (const [roomId, users] of roomMap.entries()) {
    const uniqueSorted = [...new Set(users)].sort()
    const target = [userAId, userBId].sort()
    if (JSON.stringify(uniqueSorted) === JSON.stringify(target)) {
      return roomId
    }
  }

  // 4. Fetch profile name of userB to use as room name
  const { data: profileB, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userBId)
    .single()

  if (profileError) throw profileError
  const roomName = profileB.username ?? "Chat"

  // 5. If not found, create new room
  const { data: newRoom, error: createError } = await supabase
    .from("chat_rooms")
    .insert([{ name: roomName, is_group: false, created_by: null }])
    .select()
    .single()

  if (createError) throw createError

  // 6. Add both users to the room
  await supabase.from("room_members").insert([
    { room_id: newRoom.id, user_id: userAId },
    { room_id: newRoom.id, user_id: userBId },
  ])

  return newRoom.id
}