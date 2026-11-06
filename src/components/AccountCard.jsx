import { useState } from "react";
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
        로그인되었습니다. 나만의 할 일을 기록할 준비가 됐어요.
      </p>
      <dl className="account-info">
        <dt>이메일</dt>
        <dd>{user.email}</dd>
      </dl>
      <p className="next-step">다음 실습에서 할 일 목록을 연결할 예정이에요.</p>
      <button className="primary" disabled={busy} onClick={handleLogout}>
        {busy ? "로그아웃 중…" : "로그아웃"}
      </button>
      {error && <p className="message error" role="alert">{error}</p>}
    </>
  );
}
