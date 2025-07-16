import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export default function InitAuth() {
  useEffect(() => {
    useAuthStore.getState().restoreSession();
  }, []);

  return null;
}
