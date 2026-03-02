"use client"; // لازم يكون أول سطر

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebase-client";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.replace("/auth/login"); // مش مسجل دخول → login
      } else {
        // جلب الـ custom claims (role + stationScope)
        const tokenResult = await currentUser.getIdTokenResult(true);
        const role = tokenResult.claims.role || "user";
        const stationScope = tokenResult.claims.stationScope || [];

        console.log('ProtectedRoute - Full token result:', tokenResult);
        console.log('ProtectedRoute - All claims:', tokenResult.claims);
        console.log('ProtectedRoute - User role:', role);
        console.log('ProtectedRoute - User stationScope:', stationScope);
        console.log('ProtectedRoute - StationScope type:', typeof stationScope);
        console.log('ProtectedRoute - StationScope length:', stationScope.length);
        console.log('ProtectedRoute - StationScope is array:', Array.isArray(stationScope));

        // تحقق من role
        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
          router.replace("/forbidden"); // مش من الـ roles المسموح
        } else {
          setUser({ ...currentUser, role, stationScope });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, allowedRoles]);

  if (loading) return <div>Loading...</div>;

  // لو كل حاجة تمام
  return user ? <>{children}</> : null;
}