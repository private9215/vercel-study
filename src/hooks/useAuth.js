import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // INITIAL_SESSION으로 저장된 세션을 복원하고 이후 인증 변경을 구독합니다.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setReady(true);
      },
    );
    return () => subscription.unsubscribe();
  }, []);

  return { session, ready };
}
