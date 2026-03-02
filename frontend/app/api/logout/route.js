import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    console.log("API - Token deleted successfully");
    return Response.json({ success: true });
  } catch (error) {
    console.error("API - Logout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}