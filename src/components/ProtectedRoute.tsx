// src/components/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface Props {
  children: ReactNode; // more flexible than JSX.Element
}

export default function ProtectedRoute({ children }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    // User is not logged in
    return <Navigate to="/" replace />;
  }

  // User is logged in
  return <>{children}</>; // wrap children in fragment
}

