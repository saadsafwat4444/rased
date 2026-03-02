"use client";

import { auth, db } from "../../../firebase/firebase-client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RingLoader } from "react-spinners";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters");
      return;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email is required");
      return;
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (phone && (typeof phone !== 'string' || !/^\d{11}$/.test(phone))) {
      setError("Phone must be exactly 11 digits");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;
        

      const userId = user.uid;

      await setDoc(doc(db, "users", userId), {
        id: userId,
        fullName,
        phone,
        role:"user",
      
        stationScopes: [],
        createdAt: serverTimestamp(),
      });

      console.log("User document created successfully");

      // حاول تعيين role ولكن لا تتوقف إذا فشل
      try {
        await fetch('/users/set-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: userId, role: 'user' }) 
        });
        console.log("Role set successfully");
      } catch (roleErr) {
        console.log("Role setting failed, but continuing:", roleErr);
      }

      const token = await user.getIdToken(true);
      console.log("Got token:", token.substring(0, 20) + "...");

      const res = await fetch("/api/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      console.log("Set token response:", res.status);

      if (!res.ok) {
        throw new Error("Failed to set token");
      }

      // انتظر شوية للتأكد من تخزين التوكن
      console.log("Waiting for cookie to be set...");
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("Redirecting to dashboard...");
      
      window.location.href = "/user-dashboard";
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <RingLoader color="#2563EB" size={60} />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      {/* Card */}
      <div className="max-w-md w-full bg-gray-800 shadow-2xl rounded-3xl p-10 text-gray-100">
        <h2 className="text-4xl font-extrabold text-indigo-400 mb-8 text-center">
          Register New Account
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="px-5 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-5 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl shadow-lg transform transition-transform hover:-translate-y-1 hover:scale-105 duration-300"
          >
            Register
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        <p className="mt-6 text-gray-400 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-indigo-400 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}