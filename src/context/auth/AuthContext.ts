import { createContext } from "react";

export type MeResponse = {
  id: number; company_name: string; first_name: string; last_name: string;
  role_id: number; role_code?: string; email: string; status: number;
};

export type AuthCtx = { user: MeResponse | null; loading: boolean; logout: () => void };

export const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  logout: () => {},
});
