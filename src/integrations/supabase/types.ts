export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          bio: string
          created_at: string | null
          election_id: string
          id: string
          image: string | null
          name: string
          party: string
          updated_at: string | null
        }
        Insert: {
          bio: string
          created_at?: string | null
          election_id: string
          id?: string
          image?: string | null
          name: string
          party: string
          updated_at?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          election_id?: string
          id?: string
          image?: string | null
          name?: string
          party?: string
          updated_at?: string | null
        }
      }
      elections: {
        Row: {
          created_at: string | null
          description: string
          end_date: string
          id: string
          image: string | null
          start_date: string
          status: 'upcoming' | 'active' | 'ended'
          title: string
          total_votes: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          image?: string | null
          start_date: string
          status: 'upcoming' | 'active' | 'ended'
          title: string
          total_votes?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          image?: string | null
          start_date?: string
          status?: 'upcoming' | 'active' | 'ended'
          title?: string
          total_votes?: number
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}