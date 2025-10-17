// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      streamlined_briefs: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'Draft' | 'In Review' | 'Approved'
          author: string
          tags: string[] | null
          visual_preview: string | null
          created_at: string
          updated_at: string
          brief_data: any // Your MarketingBriefDocument
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'Draft' | 'In Review' | 'Approved'
          author: string
          tags?: string[] | null
          visual_preview?: string | null
          brief_data: any
        }
        Update: {
          title?: string
          description?: string | null
          status?: 'Draft' | 'In Review' | 'Approved'
          author?: string
          tags?: string[] | null
          visual_preview?: string | null
          brief_data?: any
          updated_at?: string
        }
      }
    }
  }
}