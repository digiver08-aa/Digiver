export interface Persona {
  id: string;

  userId: string;

  name: string;
  slug: string;

  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;

  isActive: boolean;
  isPublic: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonaInput {
  name: string;
  slug: string;

  title?: string;
  bio?: string;

  avatarUrl?: string;
  bannerUrl?: string;

  isPublic?: boolean;
}

export interface UpdatePersonaInput {
  name?: string;
  slug?: string;

  title?: string | null;
  bio?: string | null;

  avatarUrl?: string | null;
  bannerUrl?: string | null;

  isActive?: boolean;
  isPublic?: boolean;
}

export interface PersonaResponse {
  success: boolean;
  message: string;
  data: Persona | null;
}

export interface PersonasResponse {
  success: boolean;
  message: string;
  data: Persona[];
}