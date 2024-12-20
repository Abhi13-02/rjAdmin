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
    <div className="flex flex-col items-center gap-5">
      <h1>Register</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-96"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-96"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-96 text-black"
      />
      <input
        type="text"
        name="adminSecret"
        placeholder="Admin Secret (optional)"
        value={formData.adminSecret}
        onChange={handleChange}
        className="w-96"
      />
      <button className="bg-blue-500 px-4 py-2 rounded" onClick={handleRegister}>Register</button>
    </div>
  );
}
