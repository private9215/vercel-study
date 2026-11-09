import { useState } from "react";
import TodoList from "./TodoList";
import { getAuthErrorMessage, signOut } from "../services/auth";

export default function AccountCard({ user }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await signOut();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <span className="eyebrow">반가워요</span>
      <h1 id="auth-title">{user.user_metadata?.nickname || "사용자"}님, 환영해요.</h1>
      <p className="description">
        작은 실천을 하나씩 기록하고, 오늘의 할 일을 완성해 보세요.
      </p>
      <dl className="account-info">
        <dt>이메일</dt>
        <dd>{user.email}</dd>
      </dl>
      <TodoList key={user.id} userId={user.id} nickname={user.user_metadata?.nickname || "사용자"} />
      <button className="primary" disabled={busy} onClick={handleLogout}>
        {busy ? "로그아웃 중…" : "로그아웃"}
      </button>
      {error && <p className="message error" role="alert">{error}</p>}
    </>
  );
}
