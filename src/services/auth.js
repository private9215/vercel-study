import { supabase } from "../lib/supabase";

export async function signUp({ email, password, nickname }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { nickname: nickname.trim() },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
}

export function getAuthErrorMessage(error) {
  const messages = {
    invalid_credentials: "이메일 또는 비밀번호를 확인해 주세요.",
    email_not_confirmed: "이메일 인증을 완료한 뒤 로그인해 주세요.",
    user_already_exists: "이미 가입된 이메일입니다. 로그인해 주세요.",
    over_email_send_rate_limit: "메일 요청이 많습니다. 잠시 후 다시 시도해 주세요.",
    weak_password: "더 강력한 비밀번호를 사용해 주세요.",
  };
  return messages[error.code] || error.message || "요청에 실패했습니다. 다시 시도해 주세요.";
}
