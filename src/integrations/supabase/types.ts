export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          last_activity: string
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          last_activity?: string
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          last_activity?: string
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      beta_registrations: {
        Row: {
          created_at: string
          email: string
          id: string
          nombre: string
          tarea_automatizar: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nombre: string
          tarea_automatizar: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          tarea_automatizar?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      consulta_limits: {
        Row: {
          consultas_realizadas: number
          creado_en: string
          id: string
          ultima_consulta: string | null
          user_ip: string
        }
        Insert: {
          consultas_realizadas?: number
          creado_en?: string
          id?: string
          ultima_consulta?: string | null
          user_ip: string
        }
        Update: {
          consultas_realizadas?: number
          creado_en?: string
          id?: string
          ultima_consulta?: string | null
          user_ip?: string
        }
        Relationships: []
      }
      consultas: {
        Row: {
          actividad: string
          ciudad_busqueda: string | null
          comunicacion_preferencias: Json | null
          creado_en: string | null
          email: string
          especialidad_buscada: string | null
          experiencia_nocode: string
          frustraciones: string
          icp_generado: string | null
          id: string
          nombre: string
          nombre_proyecto: string | null
          numero_busqueda: number
          pais: string
          pais_busqueda: string | null
          resultados_encontrados: number | null
          situacion: Json
          tarea_automatizar: string
          user_ip: string | null
          whatsapp: string
        }
        Insert: {
          actividad: string
          ciudad_busqueda?: string | null
          comunicacion_preferencias?: Json | null
          creado_en?: string | null
          email: string
          especialidad_buscada?: string | null
          experiencia_nocode: string
          frustraciones?: string
          icp_generado?: string | null
          id?: string
          nombre: string
          nombre_proyecto?: string | null
          numero_busqueda: number
          pais: string
          pais_busqueda?: string | null
          resultados_encontrados?: number | null
          situacion?: Json
          tarea_automatizar: string
          user_ip?: string | null
          whatsapp?: string
        }
        Update: {
          actividad?: string
          ciudad_busqueda?: string | null
          comunicacion_preferencias?: Json | null
          creado_en?: string | null
          email?: string
          especialidad_buscada?: string | null
          experiencia_nocode?: string
          frustraciones?: string
          icp_generado?: string | null
          id?: string
          nombre?: string
          nombre_proyecto?: string | null
          numero_busqueda?: number
          pais?: string
          pais_busqueda?: string | null
          resultados_encontrados?: number | null
          situacion?: Json
          tarea_automatizar?: string
          user_ip?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      descargas: {
        Row: {
          actividad_proyecto: string | null
          correo: string
          creado_en: string | null
          experiencia_nocode: string | null
          flujo: string
          frustracion_ia: string | null
          id: string
          nombre: string
          pais: string | null
          quiere_recursos: Json | null
          situacion_actual: Json | null
          situacion_otra: string | null
          tarea_automatizar: string | null
          whatsapp: string | null
        }
        Insert: {
          actividad_proyecto?: string | null
          correo: string
          creado_en?: string | null
          experiencia_nocode?: string | null
          flujo: string
          frustracion_ia?: string | null
          id?: string
          nombre: string
          pais?: string | null
          quiere_recursos?: Json | null
          situacion_actual?: Json | null
          situacion_otra?: string | null
          tarea_automatizar?: string | null
          whatsapp?: string | null
        }
        Update: {
          actividad_proyecto?: string | null
          correo?: string
          creado_en?: string | null
          experiencia_nocode?: string | null
          flujo?: string
          frustracion_ia?: string | null
          id?: string
          nombre?: string
          pais?: string | null
          quiere_recursos?: Json | null
          situacion_actual?: Json | null
          situacion_otra?: string | null
          tarea_automatizar?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      eventos_usuarios: {
        Row: {
          creado_en: string | null
          descripcion: string | null
          id: string
          pagina: string
          paso_numero: number | null
          recurso_id: string | null
          referrer: string | null
          tiempo_segundos: number | null
          tipo_evento: string
          user_agent: string | null
        }
        Insert: {
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          pagina: string
          paso_numero?: number | null
          recurso_id?: string | null
          referrer?: string | null
          tiempo_segundos?: number | null
          tipo_evento: string
          user_agent?: string | null
        }
        Update: {
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          pagina?: string
          paso_numero?: number | null
          recurso_id?: string | null
          referrer?: string | null
          tiempo_segundos?: number | null
          tipo_evento?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      Feedback_productos: {
        Row: {
          fecha_subida: string
          feedback: string | null
          id: string
          producto: string
        }
        Insert: {
          fecha_subida?: string
          feedback?: string | null
          id?: string
          producto: string
        }
        Update: {
          fecha_subida?: string
          feedback?: string | null
          id?: string
          producto?: string
        }
        Relationships: []
      }
      flujos: {
        Row: {
          actualizado_en: string | null
          creado_en: string | null
          descripcion: string | null
          id: string
          imagen_url: string | null
          link_descarga: string | null
          nombre: string
          pasos: Json | null
          plataformas: Json | null
          visible: boolean
        }
        Insert: {
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          link_descarga?: string | null
          nombre: string
          pasos?: Json | null
          plataformas?: Json | null
          visible?: boolean
        }
        Update: {
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          link_descarga?: string | null
          nombre?: string
          pasos?: Json | null
          plataformas?: Json | null
          visible?: boolean
        }
        Relationships: []
      }
      fotovalentina: {
        Row: {
          dia: number
          fecha_creacion: string | null
          id: number
          nombre: string
          numero_turno: string
        }
        Insert: {
          dia: number
          fecha_creacion?: string | null
          id?: number
          nombre: string
          numero_turno: string
        }
        Update: {
          dia?: number
          fecha_creacion?: string | null
          id?: number
          nombre?: string
          numero_turno?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      tutoriales: {
        Row: {
          actualizado_en: string | null
          creado_en: string | null
          descripcion: string | null
          id: string
          imagen_url: string | null
          plataformas: Json | null
          titulo: string
          video_url: string | null
        }
        Insert: {
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          plataformas?: Json | null
          titulo: string
          video_url?: string | null
        }
        Update: {
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          plataformas?: Json | null
          titulo?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_admin: {
        Args: { p_password: string }
        Returns: {
          expires_at: string
          message: string
          session_token: string
          success: boolean
        }[]
      }
      logout_admin_session: {
        Args: { p_session_token: string }
        Returns: boolean
      }
      validate_admin_session: {
        Args: { p_session_token: string }
        Returns: {
          expires_at: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
