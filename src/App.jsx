import AccountCard from "./components/AccountCard";
import AuthForm from "./components/AuthForm";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

export default function App() {
  const { session, ready } = useAuth();

  return (
    <main className="auth-layout">
      <header className="brand">
        <span className="brand-icon" aria-hidden="true">✓</span>
        오늘의 할 일
      </header>
      <section className={`auth-card${session ? " todo-card" : ""}`} aria-labelledby={ready ? "auth-title" : undefined}>
        {!ready ? (
          <p role="status">로그인 상태를 확인하고 있어요…</p>
        ) : session ? (
          <AccountCard key={session.user.id} user={session.user} />
        ) : (
          <AuthForm />
        )}
      </section>
      <footer>실행 환경: {import.meta.env.VITE_APP_ENV || "미설정"}</footer>
    </main>
  );
}
