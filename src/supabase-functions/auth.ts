import { supabase } from "@/lib/supabaseClient"

export async function signUpNewUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: 'https://localhost:5173',
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
        redirectTo: 'http://localhost:5173/reset-password',
    })
}

export async function updateUserPassword(password: string) {
    await supabase.auth.updateUser({ password: password })
}