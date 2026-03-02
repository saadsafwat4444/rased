export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) return new Response(JSON.stringify({ address: "" }));

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
       return new Response(JSON.stringify({
      address: data.display_name || "",
      city: data.address?.city || data.address?.town || "",
      state: data.address?.state || "",
      country: data.address?.country || ""
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ address: "" }));
  }
}

 