 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const router = useRouter();
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const r = await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const data = await r.json();
      if(!r.ok) throw new Error(data.error || "Login failed");
      router.push("/admin"); router.refresh();
    } catch(err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setBusy(false); }
  }
  return <main className="admin-shell"><div className="wrap"><div className="loginbox"><a className="brand" href="/"><span className="logo">MR</span><span>MIR RAJ<small>ADMIN PANEL</small></span></a><h1>Admin sign in</h1><p className="muted">Sign in to manage products and customer orders.</p><form onSubmit={submit} className="formgrid"><label className="field full">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username"/></label><label className="field full">Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label><div className="field full"><button className="btn" disabled={busy}>{busy?"Signing in...":"Sign in"}</button></div></form>{error&&<div className="toast error">{error}</div>}<p className="note"><a href="/">← Back to store</a></p></div></div></main>;
}
