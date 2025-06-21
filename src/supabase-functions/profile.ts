import { supabase } from '@/lib/supabaseClient'
import type { Profile } from './chat'
export async function createProfile(userId: string, name: string) {
    const { data, error } = await supabase
                            .from('profiles')
                            .insert([
                                {
                                    id: userId,
                                    username: name
                                }
                            ])
    
    if (error) {
        return null
    } else {
        return data
    }
}

export async function updateProfilePic(image_link: string) {
    const {data, error} = await supabase.from("profiles")
    .update({avatar_url: image_link})
    .eq('id', (await supabase.auth.getUser()).data.user?.id!)

    if (error) {
        return null
    } else {
        return data
    }
}

export async function updateProfileName(name: string) {
    const {data, error} = await supabase.from("profiles")
    .update({username: name})
    .eq('id', (await supabase.auth.getUser()).data.user?.id!)

    if (error) {
        console.log(error.message);
        
        return null
    } else {
        return data
    }
}

// --- Users (Profiles) ------------------------------------

/**
 * Fetch **all** users in your app (from profiles) for selection.
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at")
    .order("username", { ascending: true })

  if (error) {
    console.error("fetchAllUsers error:", error.message)
    return []
  }
  return data as Profile[]
}