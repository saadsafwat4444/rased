"use client";

import { auth, db } from "../../../firebase/firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [firebaseError, setFirebaseError] = useState("");

  const router = useRouter();

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });
    if (!validate()) return;

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log("User logged in:", userCredential.user.uid);
        const user = userCredential.user;
        const token=await user.getIdToken(true);
        await fetch("/api/set-token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token }),
});
      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role || "user"; 

      // redirect حسب الدور
      if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "supervisor") {
        router.push("/supervisor-dashboard");
      } else {
        router.push("/user-dashboard");
      }


       
    }  catch (err) {
  console.error("Firebase Auth Error Full:", err); // اطبع الكائن كله
  console.error("Error Code:", err.code);
  console.error("Error Message:", err.message);
  setFirebaseError(err.message || "Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 shadow-xl rounded-2xl p-8 text-gray-100">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          تسجيل الدخول
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 mt-1">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {touched.password && errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}

          {firebaseError && <p className="text-red-500 mb-4">{firebaseError}</p>}

          <button
            type="submit"
            className={`w-full p-3 rounded text-white ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center">
          ليس لديك حساب؟{" "}
          <a
            href="/auth/register"
            className="text-indigo-400 hover:underline font-medium"
          >
            سجل الآن
          </a>
        </p>
      </div>
    </div>
  );
}