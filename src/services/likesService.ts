import { supabase } from '../lib/supabase'

export type BlogLikeRow = { slug: string; likes: number; updated_at?: string }

export async function getLikes(slug: string): Promise<number> {
  const { data, error } = await supabase
    .from('blog_likes')
    .select('likes')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data?.likes ?? 0
}

export async function setLikes(slug: string, likes: number): Promise<number> {
  // Upsert explicit value (clamped)
  const next = Math.max(0, Math.floor(likes))
  const { data, error } = await supabase
    .from('blog_likes')
    .upsert({ slug, likes: next })
    .select('likes')
    .single()

  if (error) throw error
  return data.likes
}

export async function adjustLikes(slug: string, delta: number): Promise<number> {
  const { data, error } = await supabase.rpc('adjust_blog_likes', { p_slug: slug, p_delta: delta })
  if (error) throw error
  return data as number
}
