"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AuthPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signUp(e: FormEvent) {
    e.preventDefault();
    setMsg("注册中...");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    setMsg("注册成功，请查收邮箱验证邮件（若开启了邮箱验证）。");
  }

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setMsg("登录中...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    setMsg("登录成功");
    router.push("/dashboard/todo");
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", display: "grid", gap: 12 }}>
      <h1>登录 / 注册</h1>
      <form style={{ display: "grid", gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="邮箱" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="密码（至少6位）"
        />
        <button onClick={signIn}>登录</button>
        <button onClick={signUp} type="button">注册</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
