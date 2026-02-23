export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname !== "/confziwr" || request.method !== "POST") {
      return new Response("Not Found", { status: 404 })
    }

    try {
      const data = await request.json()
      let { signature, timestamp, nonce, hmac } = data
      if (!signature || !timestamp || !nonce || !hmac) return Response.json({ repo: "" })

      signature = signature.replace(/:/g, "").toUpperCase()
      if (signature !== env.VALID_SIGNATURE) return Response.json({ repo: "" })

      const now = Math.floor(Date.now() / 1000)
      if (Math.abs(now - timestamp) > 30) return Response.json({ repo: "" })

      const payload = `${signature}|${timestamp}|${nonce}`
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(env.SECRET_KEY),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
      const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
      const expectedHmac = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, "0")).join("")

      if (expectedHmac !== hmac) return Response.json({ repo: "" })

      return Response.json({ repo: "https://pastebin.com/raw/J9TtFFDX" })
    } catch {
      return Response.json({ repo: "" })
    }
  }
}
