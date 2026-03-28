export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) return new Response(JSON.stringify({ address: "" }));

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'RasedApp/1.0 (https://github.com/saadsafwat4444/rased)'
        }
      }
    );
    
    if (!res.ok) {
      console.error('Nominatim API error:', res.status, res.statusText);
      return new Response(JSON.stringify({ address: "Location unavailable" }));
    }
    
    const data = await res.json();
    
    if (data.error) {
      console.error('Nominatim API returned error:', data.error);
      return new Response(JSON.stringify({ address: "Location unavailable" }));
    }
    
    return new Response(JSON.stringify({
      address: data.display_name || "Unknown location",
      city: data.address?.city || data.address?.town || "",
      state: data.address?.state || "",
      country: data.address?.country || ""
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return new Response(JSON.stringify({ address: "Geocoding failed" }));
  }
}