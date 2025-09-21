// src/components/PublicRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface Props {
  children: ReactNode; // allows multiple elements, strings, fragments
}

export default function PublicRoute({ children }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    // User is already logged in
    return <Navigate to="/profile" replace />;
  }

  // User is not logged in
  return <>{children}</>; // wrap children in fragment
}
