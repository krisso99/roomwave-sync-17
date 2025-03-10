export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_auth_attempts: {
        Row: {
          browser_info: string | null
          created_at: string
          device_info: string | null
          id: string
          ip_address: string
          password_hash: string
          username: string
        }
        Insert: {
          browser_info?: string | null
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address: string
          password_hash: string
          username: string
        }
        Update: {
          browser_info?: string | null
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      analytics_accounts: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          profile_id: string | null
          property_id: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          property_id: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          property_id?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_attempts: {
        Row: {
          browser_info: string | null
          created_at: string
          device_info: string | null
          id: string
          ip_address: string
          password_hash: string
        }
        Insert: {
          browser_info?: string | null
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address: string
          password_hash: string
        }
        Update: {
          browser_info?: string | null
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string
          password_hash?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string
          date: string
          id: string
          property_id: string
          status: Database["public"]["Enums"]["availability_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          property_id: string
          status?: Database["public"]["Enums"]["availability_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          property_id?: string
          status?: Database["public"]["Enums"]["availability_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          guest_name: string
          id: string
          platform_id: string | null
          property_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          guest_name: string
          id?: string
          platform_id?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          guest_name?: string
          id?: string
          platform_id?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          brand_id: string | null
          employee_id: string | null
          id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          brand_id?: string | null
          employee_id?: string | null
          id?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          brand_id?: string | null
          employee_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_assignments_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_comments: {
        Row: {
          comment_text: string
          comment_type: Database["public"]["Enums"]["comment_type"] | null
          created_at: string
          day_number: number
          id: string
          month: number
          profile_id: string | null
          updated_at: string
          year: number
        }
        Insert: {
          comment_text: string
          comment_type?: Database["public"]["Enums"]["comment_type"] | null
          created_at?: string
          day_number: number
          id?: string
          month: number
          profile_id?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          comment_text?: string
          comment_type?: Database["public"]["Enums"]["comment_type"] | null
          created_at?: string
          day_number?: number
          id?: string
          month?: number
          profile_id?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "calendar_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_analytics: {
        Row: {
          client_id: string | null
          created_at: string
          date: string
          id: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date?: string
          id?: string
          metric_name: string
          metric_value: number
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date?: string
          id?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_analytics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          notes: string | null
          phone: string | null
          profile_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_calendar: {
        Row: {
          client_id: string | null
          client_notes: string | null
          content_text: string | null
          created_at: string
          hashtags: string[] | null
          id: string
          media_urls: string[] | null
          platform: Database["public"]["Enums"]["platform_type"]
          profile_id: string | null
          scheduled_for: string
          status: Database["public"]["Enums"]["post_status"] | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_notes?: string | null
          content_text?: string | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          platform: Database["public"]["Enums"]["platform_type"]
          profile_id?: string | null
          scheduled_for: string
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_notes?: string | null
          content_text?: string | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          platform?: Database["public"]["Enums"]["platform_type"]
          profile_id?: string | null
          scheduled_for?: string
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_calendar_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_performance: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_name: string
          metric_value: number
          notes: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          metric_name: string
          metric_value: number
          notes?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_name?: string
          metric_value?: number
          notes?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_performance_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      goodies_stock: {
        Row: {
          created_at: string
          current_stock: number
          id: number
          initial_stock: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_stock?: number
          id?: number
          initial_stock?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_stock?: number
          id?: number
          initial_stock?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      historical_participants: {
        Row: {
          created_at: string
          eligible_for_tombola: boolean | null
          email: string | null
          id: string
          name: string
          original_tombola_id: string | null
          original_wheel_spin_id: number | null
          phone: string
          prize: string | null
          quiz_correct_answers: number | null
          reset_date: string
          university: string
        }
        Insert: {
          created_at?: string
          eligible_for_tombola?: boolean | null
          email?: string | null
          id?: string
          name: string
          original_tombola_id?: string | null
          original_wheel_spin_id?: number | null
          phone: string
          prize?: string | null
          quiz_correct_answers?: number | null
          reset_date?: string
          university: string
        }
        Update: {
          created_at?: string
          eligible_for_tombola?: boolean | null
          email?: string | null
          id?: string
          name?: string
          original_tombola_id?: string | null
          original_wheel_spin_id?: number | null
          phone?: string
          prize?: string | null
          quiz_correct_answers?: number | null
          reset_date?: string
          university?: string
        }
        Relationships: []
      }
      make_webhooks: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          platform_ids: string[] | null
          updated_at: string
          webhook_url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          platform_ids?: string[] | null
          updated_at?: string
          webhook_url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          platform_ids?: string[] | null
          updated_at?: string
          webhook_url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_user_backups: {
        Row: {
          backup_timestamp: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          original_tombola_id: string | null
          original_wheel_spin_id: number | null
          phone: string
          prize: string | null
          quiz_correct_answers: number | null
          university: string
        }
        Insert: {
          backup_timestamp?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          original_tombola_id?: string | null
          original_wheel_spin_id?: number | null
          phone: string
          prize?: string | null
          quiz_correct_answers?: number | null
          university: string
        }
        Update: {
          backup_timestamp?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          original_tombola_id?: string | null
          original_wheel_spin_id?: number | null
          phone?: string
          prize?: string | null
          quiz_correct_answers?: number | null
          university?: string
        }
        Relationships: []
      }
      platforms: {
        Row: {
          api_details: Json | null
          created_at: string
          ical_url: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          api_details?: Json | null
          created_at?: string
          ical_url?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          api_details?: Json | null
          created_at?: string
          ical_url?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      predefined_spins: {
        Row: {
          created_at: string
          id: number
          is_used: boolean | null
          target_slice: number
        }
        Insert: {
          created_at?: string
          id?: never
          is_used?: boolean | null
          target_slice: number
        }
        Update: {
          created_at?: string
          id?: never
          is_used?: boolean | null
          target_slice?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          company_size: string | null
          contact_address: string | null
          contact_phone: string | null
          created_at: string
          department: string | null
          email: string
          employee_role: Database["public"]["Enums"]["employee_role"] | null
          full_name: string | null
          hire_date: string | null
          id: string
          industry: Database["public"]["Enums"]["industry_type"] | null
          industry_sector: string | null
          is_active: boolean | null
          is_approved: boolean | null
          is_super_admin: boolean | null
          last_login: string | null
          performance_rating: number | null
          preferred_contact_method: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          company_size?: string | null
          contact_address?: string | null
          contact_phone?: string | null
          created_at?: string
          department?: string | null
          email: string
          employee_role?: Database["public"]["Enums"]["employee_role"] | null
          full_name?: string | null
          hire_date?: string | null
          id: string
          industry?: Database["public"]["Enums"]["industry_type"] | null
          industry_sector?: string | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_super_admin?: boolean | null
          last_login?: string | null
          performance_rating?: number | null
          preferred_contact_method?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          company_size?: string | null
          contact_address?: string | null
          contact_phone?: string | null
          created_at?: string
          department?: string | null
          email?: string
          employee_role?: Database["public"]["Enums"]["employee_role"] | null
          full_name?: string | null
          hire_date?: string | null
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"] | null
          industry_sector?: string | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_super_admin?: boolean | null
          last_login?: string | null
          performance_rating?: number | null
          preferred_contact_method?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_history: {
        Row: {
          browser_info: string | null
          category: string
          created_at: string
          device_info: string | null
          id: string
          ip_address: string | null
          prompt: string
        }
        Insert: {
          browser_info?: string | null
          category: string
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          prompt: string
        }
        Update: {
          browser_info?: string | null
          category?: string
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          prompt?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          owner_id: string
          price_per_night: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          owner_id: string
          price_per_night: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          owner_id?: string
          price_per_night?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "property_managers"
            referencedColumns: ["id"]
          },
        ]
      }
      property_managers: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          listing_count: string | null
          property_type: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          listing_count?: string | null
          property_type?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          listing_count?: string | null
          property_type?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          confirmation_sent: boolean | null
          created_at: string
          email: string
          full_name: string
          id: string
          occasion: Database["public"]["Enums"]["reservation_occasion"]
          people: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string
          table_id: string | null
          whatsapp: string
        }
        Insert: {
          confirmation_sent?: boolean | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          occasion?: Database["public"]["Enums"]["reservation_occasion"]
          people: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string
          table_id?: string | null
          whatsapp: string
        }
        Update: {
          confirmation_sent?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          occasion?: Database["public"]["Enums"]["reservation_occasion"]
          people?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string
          table_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token: string | null
          account_name: string
          created_at: string
          id: string
          platform: Database["public"]["Enums"]["platform_type"]
          profile_id: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_name: string
          created_at?: string
          id?: string
          platform: Database["public"]["Enums"]["platform_type"]
          profile_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_name?: string
          created_at?: string
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          profile_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          buffer_id: string | null
          content: string
          created_at: string | null
          id: string
          media_urls: string[] | null
          platform: Database["public"]["Enums"]["social_platform"] | null
          profile_id: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["post_status"] | null
          updated_at: string | null
        }
        Insert: {
          buffer_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          media_urls?: string[] | null
          platform?: Database["public"]["Enums"]["social_platform"] | null
          profile_id?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Update: {
          buffer_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          media_urls?: string[] | null
          platform?: Database["public"]["Enums"]["social_platform"] | null
          profile_id?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          profile_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          industry: Database["public"]["Enums"]["industry_type"] | null
          is_active: boolean | null
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          industry?: Database["public"]["Enums"]["industry_type"] | null
          is_active?: boolean | null
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          industry?: Database["public"]["Enums"]["industry_type"] | null
          is_active?: boolean | null
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tombola_participants: {
        Row: {
          claimed: boolean | null
          contacted: boolean | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          prize: string
          quiz_correct_answers: number
          university: string
          wheel_spin_id: number | null
        }
        Insert: {
          claimed?: boolean | null
          contacted?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          prize: string
          quiz_correct_answers: number
          university: string
          wheel_spin_id?: number | null
        }
        Update: {
          claimed?: boolean | null
          contacted?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          prize?: string
          quiz_correct_answers?: number
          university?: string
          wheel_spin_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tombola_participants_wheel_spin_id_fkey"
            columns: ["wheel_spin_id"]
            isOneToOne: false
            referencedRelation: "wheel_spins"
            referencedColumns: ["id"]
          },
        ]
      }
      tombola_winners: {
        Row: {
          created_at: string
          id: string
          participant_id: string | null
          position: number
          prize: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_id?: string | null
          position: number
          prize: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_id?: string | null
          position?: number
          prize?: string
        }
        Relationships: [
          {
            foreignKeyName: "tombola_winners_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "tombola_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      wheel_spins: {
        Row: {
          created_at: string
          eligible_for_tombola: boolean | null
          email: string | null
          id: number
          name: string | null
          phone: string | null
          quiz_correct_answers: number | null
          result: string | null
          tombola_entry_processed: boolean | null
          university: string | null
        }
        Insert: {
          created_at?: string
          eligible_for_tombola?: boolean | null
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          quiz_correct_answers?: number | null
          result?: string | null
          tombola_entry_processed?: boolean | null
          university?: string | null
        }
        Update: {
          created_at?: string
          eligible_for_tombola?: boolean | null
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          quiz_correct_answers?: number | null
          result?: string | null
          tombola_entry_processed?: boolean | null
          university?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_employee: {
        Args: {
          email: string
          full_name: string
          employee_role: Database["public"]["Enums"]["employee_role"]
          department: string
          hire_date: string
        }
        Returns: string
      }
      add_subscription: {
        Args: {
          user_id_param: string
          plan_name_param: string
          status_param: string
          start_date_param: string
          end_date_param: string
          price_param: number
          payment_method_param: string
        }
        Returns: string
      }
      backup_and_reset_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      backup_users_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      create_user_as_super_admin: {
        Args: {
          email: string
          full_name: string
          role?: Database["public"]["Enums"]["user_role"]
          is_active?: boolean
        }
        Returns: string
      }
      delete_subscription: {
        Args: {
          subscription_id_param: string
        }
        Returns: undefined
      }
      delete_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      fetch_property_managers: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      fetch_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      reset_tombola_winners: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_property_manager: {
        Args: {
          user_id: string
          full_name_param: string
          property_type_param: string
          listing_count_param: string
          role_param: string
        }
        Returns: undefined
      }
      update_subscription: {
        Args: {
          subscription_id_param: string
          user_id_param: string
          plan_name_param: string
          status_param: string
          start_date_param: string
          end_date_param: string
          price_param: number
          payment_method_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      availability_status: "available" | "booked" | "maintenance"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      comment_type: "revision_request" | "question" | "general"
      employee_role:
        | "social_media_manager"
        | "designer"
        | "content_creator"
        | "project_manager"
      industry_type:
        | "technology"
        | "healthcare"
        | "retail"
        | "finance"
        | "education"
        | "manufacturing"
        | "hospitality"
        | "other"
      platform_type: "instagram" | "facebook" | "linkedin" | "tiktok"
      post_status: "draft" | "scheduled" | "approved" | "published"
      reservation_occasion: "dinner" | "business" | "none"
      social_platform: "twitter" | "facebook" | "instagram" | "linkedin"
      user_role: "admin" | "employee" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
