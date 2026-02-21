const VALID_SIGNATURES = [VALID_SIGNATURE];

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)

    if (url.pathname !== "/confziwr" || request.method !== "POST") {
        return new Response("Not Found", { status: 404 })
    }

    try {
        const data = await request.json()
        let signature = data.signature
        if (!signature) return Response.json({ repo: "" })

        signature = signature.replace(/:/g, "").toUpperCase()

        if (VALID_SIGNATURES.includes(signature)) {
            return Response.json({
                repo: "https://pastebin.com/raw/J9TtFFDX"
            })
        } else {
            return Response.json({ repo: "" })
        }
    } catch (e) {
        return Response.json({ repo: "" })
    }
}
