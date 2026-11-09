import { useEffect, useRef, useState } from "react";
import { addTodo, deleteTodo, getTodoErrorMessage, listTodos, setTodoComplete } from "../services/todos";

export default function TodoList({ userId, nickname }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [revision, setRevision] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    let active = true;
    listTodos(userId).then((data) => {
      if (active) { setTodos(data); setLoaded(true); }
    }).catch((err) => {
      if (active) setError(getTodoErrorMessage(err));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, revision]);

  async function mutate(action) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try { await action(); }
    catch (err) { setError(getTodoErrorMessage(err)); }
    finally { lock.current = false; setBusy(false); }
  }

  function handleAdd(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value) { setError("할 일을 입력해 주세요."); return; }
    mutate(async () => {
      const todo = await addTodo(userId, value, nickname);
      setTodos((items) => [todo, ...items]);
      setTitle("");
    });
  }

  function refresh() {
    setError("");
    setLoading(true);
    setRevision((value) => value + 1);
  }

  const completed = todos.filter((todo) => todo.is_completed).length;
  return (
    <section className="todos" aria-labelledby="todos-title" aria-busy={loading || busy}>
      <div className="todos-heading">
        <h2 id="todos-title">나의 할 일</h2>
        <button type="button" className="text-button" disabled={loading || busy} onClick={refresh}>새로고침</button>
      </div>
      <form onSubmit={handleAdd} className="todo-form">
        <label htmlFor="todo-title">새로운 할 일</label>
        <div className="todo-input-row">
          <input id="todo-title" value={title} onChange={(event) => setTitle(event.target.value)}
            placeholder="오늘 무엇을 해볼까요?" maxLength={200} required disabled={busy || loading || !loaded} />
          <button className="primary" disabled={busy || loading || !loaded || !title.trim()}>추가</button>
        </div>
      </form>
      {error && <p className="message error" role="alert">{error}</p>}
      {loading ? <p className="todo-status" role="status">할 일을 불러오고 있어요…</p> : loaded && <>
        <p className="todo-status" role="status">전체 {todos.length}개 · 완료 {completed}개 · 남은 할 일 {todos.length - completed}개</p>
        {todos.length === 0 ? <p className="todo-empty">아직 할 일이 없어요. 첫 번째 할 일을 추가해 보세요.</p> :
          <ul className="todo-list">{todos.map((todo) => (
            <li key={todo.id} className={todo.is_completed ? "is-complete" : ""}>
              <label className="todo-check">
                <input type="checkbox" checked={todo.is_completed} disabled={busy}
                  onChange={() => mutate(async () => {
                    const updated = await setTodoComplete(userId, todo.id, !todo.is_completed);
                    setTodos((items) => items.map((item) => item.id === updated.id ? updated : item));
                  })} />
                <span>{todo.title}</span>
              </label>
              <button type="button" className="delete-button" disabled={busy} aria-label={`${todo.title} 삭제`}
                onClick={() => mutate(async () => {
                  await deleteTodo(userId, todo.id);
                  setTodos((items) => items.filter((item) => item.id !== todo.id));
                })}>삭제</button>
            </li>
          ))}</ul>}
      </>}
    </section>
  );
}
