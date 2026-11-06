import { useState } from "react";
import { getAuthErrorMessage, signIn, signUp } from "../services/auth";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const signingUp = mode === "signup";

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmation("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setNotice("");

    if (signingUp && (nickname.trim().length < 2 || nickname.trim().length > 20)) {
      setError("닉네임은 앞뒤 공백을 제외하고 2~20자로 입력해 주세요.");
      return;
    }
    if (signingUp && password !== confirmation) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setBusy(true);
    try {
      if (signingUp) {
        const { session } = await signUp({ email, password, nickname });
        if (!session) {
          setMode("login");
          setNotice("이메일 인증이 필요할 수 있습니다. 받은 편지함을 확인하고, 인증 후 로그인해 주세요. 이미 가입했다면 기존 비밀번호로 로그인하세요.");
        }
      } else {
        await signIn({ email, password });
      }
      setPassword("");
      setConfirmation("");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <span className="eyebrow">작은 실천, 꾸준한 기록</span>
      <h1 id="auth-title">{signingUp ? "함께 시작해요." : "다시 만나 반가워요."}</h1>
      <p className="description">
        {signingUp
          ? "계정을 만들고 나만의 할 일을 관리하세요."
          : "로그인하고 오늘의 할 일을 이어가세요."}
      </p>

      <div className="mode-switch" aria-label="인증 방식">
        <button type="button" aria-pressed={!signingUp} disabled={busy}
          onClick={() => changeMode("login")}>
          로그인
        </button>
        <button type="button" aria-pressed={signingUp} disabled={busy}
          onClick={() => changeMode("signup")}>
          회원가입
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={busy}>
          {signingUp && (
            <label>
              닉네임
              <input name="nickname" autoComplete="nickname" required
                minLength={2} maxLength={20} value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="2~20자" />
            </label>
          )}
          <label>
            이메일
            <input name="email" type="email" autoComplete="email" required
              value={email} onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com" />
          </label>
          <label>
            비밀번호
            <input name="password" type="password" required
              autoComplete={signingUp ? "new-password" : "current-password"}
              minLength={signingUp ? 8 : undefined} value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={signingUp ? "8자 이상 입력하세요" : "비밀번호를 입력하세요"} />
          </label>
          {signingUp && (
            <label>
              비밀번호 확인
              <input name="confirmation" type="password" autoComplete="new-password"
                required value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="비밀번호를 다시 입력하세요" />
            </label>
          )}
          <button className="primary" type="submit">
            {busy ? "처리 중…" : signingUp ? "계정 만들기" : "로그인"}
          </button>
        </fieldset>
      </form>
      {error && <p className="message error" role="alert">{error}</p>}
      {notice && <p className="message notice" role="status">{notice}</p>}
    </>
  );
}
