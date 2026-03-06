"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Login exitoso");
    router.push("/dashboard");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Bienvenido</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Ingresar</button>
      </form>

      <br />

      {/* 👇 Registrarse */}
      <button onClick={() => router.push("/register")}>
        Registrarse
      </button>

      <br /><br />

      {/* 👇 Olvidé contraseña */}
      <p>
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => router.push("/forgot-password")}
        >
          ¿Olvidaste tu contraseña?
        </span>
      </p>
    </div>
  );
}