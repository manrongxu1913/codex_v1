"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Todo = {
  id: number;
  content: string;
  done: boolean;
  due_at: string | null;
};

export default function TodoDashboard() {
  const supabase = getSupabaseBrowserClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  async function loadTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("id,content,done,due_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }
    setTodos(data ?? []);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setMsg("未登录，请先登录");
      return;
    }

    const { error } = await supabase.from("todos").insert({
      user_id: userId,
      content: content.trim(),
      done: false,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setContent("");
    setMsg("新增成功");
    loadTodos();
  }

  async function toggleTodo(id: number, done: boolean) {
    const { error } = await supabase.from("todos").update({ done: !done }).eq("id", id);
    if (error) {
      setMsg(error.message);
      return;
    }
    loadTodos();
  }

  async function deleteTodo(id: number) {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      setMsg(error.message);
      return;
    }
    loadTodos();
  }

  async function logout() {
    await supabase.auth.signOut();
    location.href = "/auth";
  }

  return (
    <main style={{ maxWidth: 760, margin: "24px auto", display: "grid", gap: 12 }}>
      <h1>Todo Dashboard</h1>

      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入待办"
          style={{ flex: 1 }}
        />
        <button type="submit">新增</button>
      </form>

      <div style={{ display: "grid", gap: 8 }}>
        {todos.map((t) => (
          <div key={t.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTodo(t.id, t.done)}
            />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.content}</span>
            <button onClick={() => deleteTodo(t.id)}>删除</button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={loadTodos}>刷新</button>
        <button onClick={logout}>退出登录</button>
      </div>

      <p>{msg}</p>
    </main>
  );
}
