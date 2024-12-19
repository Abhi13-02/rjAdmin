'use client'

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
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
      <input
        type="text"
        name="adminSecret"
        placeholder="Admin Secret (optional)"
        value={formData.adminSecret}
        onChange={handleChange}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
