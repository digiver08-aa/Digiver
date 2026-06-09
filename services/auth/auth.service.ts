import { createClient } from "@/supabase/client";

import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "./auth.types";

class AuthService {
  private getSupabase() {
    return createClient();
  }

  async signUp(
    payload: SignUpInput
  ): Promise<AuthResponse<AuthUser>> {
    const supabase = this.getSupabase();

    const { data, error } =
      await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
      },
    };
  }

  async signIn(
    payload: SignInInput
  ): Promise<AuthResponse<AuthUser>> {
    const supabase = this.getSupabase();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
      },
    };
  }

  async signOut(): Promise<AuthResponse<null>> {
    const supabase = this.getSupabase();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: null,
    };
  }

  async resetPassword(
    email: string
  ): Promise<AuthResponse<null>> {
    const supabase = this.getSupabase();

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: null,
    };
  }

  async updatePassword(
    password: string
  ): Promise<AuthResponse<null>> {
    const supabase = this.getSupabase();

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
    };
  }

    return {
      success: true,
      data: null,
    };
  } 

  async getSession(): Promise<
    AuthResponse<AuthSession>
  > {
    const supabase = this.getSupabase();

    const { data, error } =
      await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        session: data.session,
      },
    };
  }
}

export const authService = new AuthService();