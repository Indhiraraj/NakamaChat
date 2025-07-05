import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner";

const environment = import.meta.env.ENVIRONMENT;

const redirectTo = environment === "production" ? "https://nakama-chat.vercel.app" : "http://localhost:5173"

export async function signUpNewUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: redirectTo,
        },
    })

    if (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.name);
        
        
        
    } else {
        return data
    }
}

export async function getCurrentUser() {
    return (await supabase.auth.getUser()).data.user
}

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) {
         console.error('Error signing in:', error.message);
        
        return null
    } else {
        return data
    }
}

export async function resetPassword(email: string) {
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${redirectTo}/auth/reset-password`,
    })
}

export async function updateUserPassword(password: string) {
    await supabase.auth.updateUser({ password: password })
}

export async function signOutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        toast(error.message)
        return false
    }
    return true
}