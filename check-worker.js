export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname !== "/confziwr" || request.method !== "POST") {
      return new Response("Not Found", { status: 404 })
    }

    try {
      const data = await request.json()
      let signature = data.signature
      if (!signature) return Response.json({ repo: "" })

      signature = signature.replace(/:/g, "").toUpperCase()

      if (signature === env.VALID_SIGNATURE) {
        return Response.json({
          repo: "https://pastebin.com/raw/J9TtFFDX"
        })
      } else {
        return Response.json({ repo: "" })
      }
    } catch {
      return Response.json({ repo: "" })
    }
  }
}
