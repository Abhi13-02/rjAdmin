"use client"

import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      // Redirect to dashboard or save session
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
