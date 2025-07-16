// Authentication types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface User {
  id: number;
  phone: string;
  phone_verify: string | null;
  email: string;
  email_verify: string | null;
  photo: string | null;
  name: string;
  bio: string | null;
  nik: string;
  foto_ktp: string | null;
  nama_lengkap: string | null;
  jenis_kelamin: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  last_login: string;
  last_access: string | null;
  deletedBy: string | null;
  status_verif: number;
  status: string | null;
  tgl_identitas: string | null;
  tgl_verifikasi: string | null;
  id_dev: string | null;
  video: string | null;
  usia: string | null;
  session_id: string;
  session_exp: string;
  broker_id: string | null;
  foto: string | null;
  foto_dukcapil: string | null;
  skor_verif_kyc: string | null;
  is_dev_account: number;
  keyspace: string | null;
  id_provinsi: string;
  id_kota: string;
  id_kecamatan: string;
  id_kelurahan: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  createdAt: string | null;
  updatedAt: string;
  deletedAt: string | null;
  username: string | null;
  account_id: string;
  token_id: number;
  secret_key: string;
}

export interface LoginResponse {
  status: boolean;
  code: number;
  message: string;
  result: {
    jwt_token: string;
    jwt_token_exp: string;
    msg: string;
    user: User;
    secret_key: string;
    jwt_refresh_token: string;
    jwt_refresh_token_exp: string;
  };
}

// Registration types - Step 1: Email registration
export interface EmailRegistrationRequest {
  phone: string;
  nik: string;
  nama: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  jenis_kelamin: string;
  email: string;
  is_dev_account: 0;
  id_provinsi: string;
  id_kota: string;
  id_kecamatan: string;
  id_kelurahan: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
}

export interface EmailRegistrationResponse {
  status: boolean;
  code: number;
  message: string;
  result: {
    session_id: string;
    session_exp: string;
    message: string;
  };
}

// Registration types - Step 2: Password registration
export interface PasswordRegistrationRequest {
  session_id: string;
  password: string;
}

export interface PasswordRegistrationResponse {
  status: boolean;
  code: number;
  message: string;
  result: {
    status: string;
    message: string;
    token: string;
    refresh_token: string;
    expires_at: string;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
  };
}

// Refresh token response type
export interface RefreshTokenResponse {
  status: boolean;
  code: number;
  message: string;
  result: {
    jwt_token: string;
    jwt_token_exp: string;
    jwt_refresh_token: string;
    jwt_refresh_token_exp: string;
    msg: string;
  };
}

// Legacy registration types (keeping for backward compatibility)
export interface RegisterRequest {
  phone: string;
  nik: string;
  nama: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  jenis_kelamin: string;
  email: string;
  is_dev_account: 0;
  id_provinsi: string;
  id_kota: string;
  id_kecamatan: string;
  id_kelurahan: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  password: string;
}

export interface RegisterResponse {
  status: boolean;
  code: number;
  message: string;
  result: {
    status: string;
    message: string;
    token: string;
    refresh_token: string;
    expires_at: string;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
  };
}

// Location types
export interface Province {
  id: string;
  name: string;
  id_geo: string;
  kode_kemendagri: string;
  nama_kemendagri: string;
  nama_bps: string;
  kode_bps: string;
  parent_bps: string;
  parent_kemendagri: string;
  lat: string;
  lon: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  keyspace: string | null;
}

export interface City {
  id: string;
  province_id: string;
  name: string;
  kode_kemendagri: string;
  nama_kemendagri: string;
  nama_bps: string;
  kode_bps: string;
  parent_bps: string;
  parent_kemendagri: string;
  lat: string;
  lon: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  keyspace: string | null;
}

export interface District {
  id: string;
  city_id: string;
  name: string;
  kode_kemendagri: string;
  nama_kemendagri: string;
  nama_bps: string;
  kode_bps: string;
  parent_bps: string;
  parent_kemendagri: string;
  lat: string;
  lon: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  keyspace: string | null;
}

export interface Village {
  id: string;
  district_id: string;
  name: string;
  kode_kemendagri: string;
  nama_kemendagri: string;
  nama_bps: string;
  kode_bps: string;
  parent_bps: string;
  parent_kemendagri: string;
  lat: string;
  lon: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  keyspace: string | null;
}

export interface LocationApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  total: number;
  result: T[];
}

export interface AuthContext {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  registerWithEmail: (
    data: EmailRegistrationRequest,
  ) => Promise<EmailRegistrationResponse>;
  registerWithPassword: (data: PasswordRegistrationRequest) => Promise<void>;
  refreshTokens: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}
