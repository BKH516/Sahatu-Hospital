
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface Hospital {
  id: number;
  account_id: number;
  full_name: string;
  address: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  email: string;
  phone_number: string;
  fcm_token: string | null;
  verification_code: string | null;
  verification_expires_at: string | null;
  email_verified_at: string | null;
  is_approved: 'approved' | 'pending' | 'rejected';
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  reset_code: string | null;
  reset_expires_at: string | null;
  roles: Role[];
  hospital: Hospital;
}

export interface HospitalProfile {
  account: Account,
  hospital: Hospital
}

export interface HospitalService {
  id: number;
  hospital_id: number;
  service_id: number;
  service_name: string;
  price: number;
  capacity: number;
}

export interface WorkSchedule {
  id: number;
  day_of_week: string;
}

export interface HospitalReservation {
  id: number;
  user_id: number;
  hospital_service_id: number;
  hospital_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    account_id: number;
    full_name: string;
    age: number;
    gender: string;
    account: {
      id: number;
      full_name: string;
      email: string;
      phone_number: string;
    };
  };
  hospital_service: {
    id: number;
    service_name: string;
    price: string;
    capacity: number;
  };
}
