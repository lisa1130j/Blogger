export interface Reply {
  id: string
  post_id: string
  user_id?: string
  author: string
  content: string
  created_at: string
}

export interface Post {
  id: string
  topic_id: string
  user_id?: string
  author: string
  content: string
  location?: string
  image_url?: string
  created_at: string
  replies?: Reply[]
}

export interface Topic {
  id: string
  title: string
  description: string
  created_at: string
  posts?: Post[]
}

export interface BlogLike {
  slug: string
  likes: number
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: Topic
        Insert: Omit<Topic, 'id' | 'created_at'>
        Update: Partial<Omit<Topic, 'id' | 'created_at'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at'>
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
      replies: {
        Row: Reply
        Insert: Omit<Reply, 'id' | 'created_at'>
        Update: Partial<Omit<Reply, 'id' | 'created_at'>>
      }
      blog_likes: {
        Row: BlogLike
        Insert: Omit<BlogLike, 'updated_at'>
        Update: Partial<Omit<BlogLike, 'slug' | 'updated_at'>>
      }
    }
  }
}
