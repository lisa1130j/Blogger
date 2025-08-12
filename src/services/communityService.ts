import { supabase } from '../lib/supabase'
import type { Database } from '../types/Database'
import type { Topic, Post, Reply } from '../types/Database'

// Topics
export async function getTopics() {
  console.log('Fetching topics...')
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching topics:', error)
    throw error
  }
  
  console.log('Topics fetched successfully:', data)
  return data
}

// Posts
export async function getPostsByTopic(topicId: string) {
  console.log('Fetching posts for topic:', topicId)
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      replies (*)
    `)
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    throw error
  }

  console.log('Posts fetched successfully:', data)
  return data
}

export async function createPost(post: Database['public']['Tables']['posts']['Insert']) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}

// Replies
export async function getRepliesByPost(postId: string) {
  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createReply(reply: Database['public']['Tables']['replies']['Insert']) {
  const { data, error } = await supabase
    .from('replies')
    .insert(reply)
    .select()
    .single()

  if (error) throw error
  return data
}

// Search
export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      replies (*)
    `)
    .or(`author.ilike.%${query}%,content.ilike.%${query}%,location.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
