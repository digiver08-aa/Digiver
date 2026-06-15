import type { Session, User } from "@supabase/supabase-js";

export interface AuthSuccess<T> {
  success: true;
  data: T;
}

export interface AuthFailure {
  success: false;
  error: string;
}

export type AuthResponse<T> =
  | AuthSuccess<T>
  | AuthFailure;

export interface SignUpInput {
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthUser {
  user: User | null;
}

export interface AuthSession {
  session: Session | null;
}