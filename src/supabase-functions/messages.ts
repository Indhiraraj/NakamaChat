import { supabase } from "@/lib/supabaseClient";

const user = (await supabase.auth.getUser()).data.user
  

export async function getRoomMessages(roomID: string) {

    const {data, error} = await supabase.from('messages')
    .select("*")
    .eq('room_id', roomID)

    if (error) {
        console.log(error.message);
        
        return null
    }
    else{
        return data
    }
    
}

export async function addMessageToRoom(roomID: string, content: string, replyTo: string | null) {

    const {data, error} = await supabase.from('messages')
    .insert([
      {
        room_id: roomID,
        sender_id: user?.id,
        content: content,
        reply_to: replyTo,
        type: 'text'
      },
    ])
    .select()
    .single()

    if (error) {
        console.log(error.message);
        
        return null
    }
    else{
        return data
    }
    
}