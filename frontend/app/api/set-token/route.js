import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const token = body.token;
    
    console.log("API - Token length:", token?.length || 0);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    });

    console.log("API - Cookie set successfully");
    return Response.json({ success: true });
  } catch (error) {
    console.error("API - Full error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}