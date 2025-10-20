import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

type Props = { children: React.ReactNode };

export default function RequireAuth({ children }: Props): React.ReactElement {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
