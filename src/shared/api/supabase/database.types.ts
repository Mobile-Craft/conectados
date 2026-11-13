export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null;
          icon: string | null;
          id: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          color?: string | null;
          icon?: string | null;
          id?: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          color?: string | null;
          icon?: string | null;
          id?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      category_translations: {
        Row: {
          category_id: string;
          description: string | null;
          locale: string;
          name: string;
        };
        Insert: {
          category_id: string;
          description?: string | null;
          locale: string;
          name: string;
        };
        Update: {
          category_id?: string;
          description?: string | null;
          locale?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'category_translations_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      pack_translations: {
        Row: {
          description: string | null;
          locale: string;
          pack_id: string;
          title: string;
        };
        Insert: {
          description?: string | null;
          locale: string;
          pack_id: string;
          title: string;
        };
        Update: {
          description?: string | null;
          locale?: string;
          pack_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pack_translations_pack_id_fkey';
            columns: ['pack_id'];
            isOneToOne: false;
            referencedRelation: 'packs';
            referencedColumns: ['id'];
          },
        ];
      };
      packs: {
        Row: {
          author_id: string | null;
          category_id: string | null;
          cover_url: string | null;
          created_at: string;
          id: string;
          intensity: number;
          min_age: number;
          published_at: string | null;
          question_count: number;
          slug: string;
          source: string;
          status: string;
          updated_at: string;
          visibility: string;
        };
        Insert: {
          author_id?: string | null;
          category_id?: string | null;
          cover_url?: string | null;
          created_at?: string;
          id?: string;
          intensity?: number;
          min_age?: number;
          published_at?: string | null;
          question_count?: number;
          slug: string;
          source?: string;
          status?: string;
          updated_at?: string;
          visibility?: string;
        };
        Update: {
          author_id?: string | null;
          category_id?: string | null;
          cover_url?: string | null;
          created_at?: string;
          id?: string;
          intensity?: number;
          min_age?: number;
          published_at?: string | null;
          question_count?: number;
          slug?: string;
          source?: string;
          status?: string;
          updated_at?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'packs_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'packs_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          age_band: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          created_at: string;
          deleted_at: string | null;
          display_name: string | null;
          id: string;
          locale: string;
          theme_pref: string;
          updated_at: string;
        };
        Insert: {
          age_band?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          display_name?: string | null;
          id: string;
          locale?: string;
          theme_pref?: string;
          updated_at?: string;
        };
        Update: {
          age_band?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          display_name?: string | null;
          id?: string;
          locale?: string;
          theme_pref?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          body: string;
          id: string;
          intensity: number;
          locale: string;
          order_index: number;
          pack_id: string;
          type: string;
        };
        Insert: {
          body: string;
          id?: string;
          intensity?: number;
          locale: string;
          order_index: number;
          pack_id: string;
          type?: string;
        };
        Update: {
          body?: string;
          id?: string;
          intensity?: number;
          locale?: string;
          order_index?: number;
          pack_id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_pack_id_fkey';
            columns: ['pack_id'];
            isOneToOne: false;
            referencedRelation: 'packs';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      age_band_of: { Args: { birth: string }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
