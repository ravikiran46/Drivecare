import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import useAuth from "@/components/Context/useAuth";
import { homeFor } from "@/lib/auth";

export function useRoleGuard(allowed) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [U, setU] = useState(null);

  useEffect(() => {
    // Wait for auth to be restored
    if (isLoading) return;

    const u = user;
    if (!u) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (!allowed.includes(u.role)) {
      navigate({ to: homeFor(u.role), replace: true });
      return;
    }
    setU(u);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, allowed.join(","), user, isLoading]);

  return U;
}
