import { supabase } from './supabase'
import { SavedResumeType } from './types'

export async function saveResume(resume: Omit<SavedResumeType, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('resumes')
      .insert([
        {
          user_id: user.id,
          name: resume.name,
          personal_info: resume.personal_info,
          education: resume.education,
          work_experience: resume.work_experience,
          projects: resume.projects,
          skills: resume.skills,
          show_icons: resume.show_icons
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error saving resume:', error)
    return { data: null, error }
  }
}

export async function loadResumes() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data as SavedResumeType[], error: null }
  } catch (error) {
    console.error('Error loading resumes:', error)
    return { data: null, error }
  }
}

export async function loadResume(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return { data: data as SavedResumeType, error: null }
  } catch (error) {
    console.error('Error loading resume:', error)
    return { data: null, error }
  }
}

export async function updateResume(id: string, resume: Omit<SavedResumeType, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('resumes')
      .update({
        name: resume.name,
        personal_info: resume.personal_info,
        education: resume.education,
        work_experience: resume.work_experience,
        projects: resume.projects,
        skills: resume.skills,
        show_icons: resume.show_icons
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating resume:', error)
    return { data: null, error }
  }
}

export async function deleteResume(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting resume:', error)
    return { error }
  }
} 