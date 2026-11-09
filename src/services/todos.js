import { supabase } from "../lib/supabase";

export async function listTodos(userId) {
  const { data, error } = await supabase.from("todo").select("id,title,is_completed,created_at")
    .eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addTodo(userId, title, nickname) {
  const { data, error } = await supabase.from("todo")
    .insert({ user_id: userId, title: title.trim(), nickname: nickname.trim().slice(0, 20) || "사용자" }).select().single();
  if (error) throw error;
  return data;
}

export async function setTodoComplete(userId, id, isComplete) {
  const { data, error } = await supabase.from("todo").update({ is_completed: isComplete })
    .eq("id", id).eq("user_id", userId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTodo(userId, id) {
  const { error } = await supabase.from("todo").delete()
    .eq("id", id).eq("user_id", userId).select("id").single();
  if (error) throw error;
}

export function getTodoErrorMessage(error) {
  if (["PGRST205", "42P01"].includes(error.code)) {
    return "할 일 저장소가 아직 준비되지 않았어요. 관리자에게 문의해 주세요.";
  }
  if (error.code === "42501") return "저장 권한을 확인하지 못했어요. 다시 로그인하거나 관리자에게 문의해 주세요.";
  if (error.code === "PGRST116") return "할 일이 삭제되었거나 접근할 수 없어요. 목록을 새로고침해 주세요.";
  return "요청을 처리하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.";
}
