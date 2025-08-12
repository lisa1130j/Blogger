import { supabase } from './supabase'
import fs from 'fs'
import path from 'path'

async function setupDatabase() {
  try {
    // Read the schema file
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    
    // Split into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.from('_raw_sql').rpc('exec', {
        query: statement
      })
      
      if (error) {
        console.error('Error executing statement:', statement)
        console.error(error)
        throw error
      }
    }
    
    console.log('Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
    throw error
  }
}

// Run the setup
setupDatabase().catch(console.error)
