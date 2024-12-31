import { supabase } from './supabase'
import { Provider } from '@supabase/supabase-js'
import { SITE_URL } from './constants'

export const signInWithProvider = async (provider: 'google' | 'github') => {
  try {
    console.log('Starting OAuth sign-in with provider:', provider)
    
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : `${SITE_URL}/auth/callback`

    console.log('Redirect URL:', redirectTo)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    
    if (error) {
      console.error('OAuth sign-in error:', error)
      throw error
    }

    console.log('OAuth sign-in response:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Error signing in:', error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  try {
    console.log('Starting sign out')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
    
    console.log('Sign out successful, reloading page')
    window.location.reload()
  } catch (error) {
    console.error('Error signing out:', error)
    return { error }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    console.log('Current user:', user)
    return { user, error: null }
  } catch (error) {
    console.error('Error getting user:', error)
    return { user: null, error }
  }
}

export const deleteUserAccount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    // Delete all resumes first
    const { error: deleteResumesError } = await supabase
      .from('resumes')
      .delete()
      .eq('user_id', user.id)

    if (deleteResumesError) throw deleteResumesError

    // Delete the user's auth account using the client method
    const { error: deleteUserError } = await supabase.rpc('delete_user')
    if (deleteUserError) throw deleteUserError

    // Sign out after deletion
    await supabase.auth.signOut()

    return { success: true }
  } catch (error) {
    console.error('Error deleting account:', error)
    throw error
  }
} 