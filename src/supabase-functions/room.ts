import { supabase } from "@/lib/supabaseClient"
import type { Profile, RoomMember } from "./chat";

/**
 * Fetch members of a specific room (including profile info).
 */
export async function fetchRoomMembers(
  roomId: string
): Promise<RoomMember[]> {
  const { data, error } = await supabase
    .from("room_members")
    .select(
      `user_id, joined_at, profile:profiles(id, username, avatar_url, created_at)`
    )
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true })

  if (error) {
    console.error("fetchRoomMembers error:", error.message)
    return []
  }

  console.log("data in supabase");
  console.log(data);
  
  
  return (data as unknown as Array<{
    user_id: string
    joined_at: string | null
    profile: Profile
  }>)
}


// --- Room Members ----------------------------------------

/**
 * Add a user into a chat room.
 */
export async function addUserToRoom(
  roomId: string,
  userId: string
): Promise<RoomMember | null> {
  const { data, error } = await supabase
    .from("room_members")
    .insert({
      room_id: roomId,
      user_id: userId,
      joined_at: new Date().toISOString(),
    })
    .select(
      `user_id, joined_at, profile:profiles(id, username, avatar_url, created_at)`
    )
    .single()

  if (error) {
    console.error("addUserToRoom error:", error.message)
    return null
  }

  // transform nested profile array to single object
  const member = data as unknown as {
    user_id: string
    joined_at: string | null
    profile: Profile[]
  }

  return {
    user_id: member.user_id,
    joined_at: member.joined_at,
    profile: member.profile[0],
  }
}

/**
 * Remove a member from room.
 */
export async function removeUserFromRoom(roomId: string, userId: string) {
  const {data, error} = await supabase.from('room_members').delete().eq("user_id", userId).eq("room_id", roomId).select("*")
console.log("something happened");

  if (error) {
    console.error(error.message);
    
    return null;
  }

  console.log(data);
  

  return data;
}

export async function getRoomDetails(roomId: string) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("created_by, is_group")
    .eq("id", roomId)
    .single()

  if (error) {
    console.error("Error fetching room details:", error.message)
    return null
  }

  return data
}
