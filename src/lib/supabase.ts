import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/Database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Test connection and configuration
const testConnection = async () => {
  try {
    console.log('Supabase URL:', supabaseUrl)
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase.from('topics').select('count').single()
    if (healthError) {
      console.error('Supabase health check failed:', healthError)
      if (healthError.message.includes('JWT')) {
        console.error('JWT validation failed. Check your anon key.')
      }
      if (healthError.message.includes('connection')) {
        console.error('Connection failed. Check your Supabase URL.')
      }
      throw healthError
    }
    console.log('Supabase health check passed')

    // Test data access
    const { data, error } = await supabase.from('topics').select('*').limit(1)
    if (error) {
      console.error('Supabase data access error:', error)
      if (error.code === '42P01') {
        console.error('Table "topics" does not exist. Check if you have run the migrations.')
      }
      throw error
    }
    console.log('Supabase connection and data access successful:', data)

  } catch (err: unknown) {
    console.error('Supabase initialization error:', err)
    if (err instanceof Error) {
      console.error('Error details:', err.message)
    }
  }
}

// Run connection test
testConnection()
