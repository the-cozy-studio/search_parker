import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    const store = getStore("team-searches");
    
    if (req.method === "GET") {
        try {
            const dataStr = await store.get("data");
            const data = dataStr ? JSON.parse(dataStr) : [];
            
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    }

    if (req.method === "POST") {
        try {
            const body = await req.json();
            const cellId = body.cellId;
            const timestamp = body.timestamp || new Date().toISOString();
            
            if (!cellId) {
                return new Response(JSON.stringify({ error: "Missing cellId" }), { status: 400 });
            }
            
            const dataStr = await store.get("data");
            const data = dataStr ? JSON.parse(dataStr) : [];
            
            data.push({ cellId, timestamp });
            
            await store.setJSON("data", data);
            
            return new Response(JSON.stringify({ status: "success" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
};
