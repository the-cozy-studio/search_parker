const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
    // We will use a blob store called "team-searches"
    // Since Netlify functions can be accessed concurrently, we use a single blob called "data"
    const store = getStore("team-searches");
    
    if (event.httpMethod === "GET") {
        try {
            const dataStr = await store.get("data");
            const data = dataStr ? JSON.parse(dataStr) : [];
            
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    if (event.httpMethod === "POST") {
        try {
            let body = {};
            if (event.body) {
                body = JSON.parse(event.body);
            }
            
            const cellId = body.cellId;
            const timestamp = body.timestamp || new Date().toISOString();
            
            if (!cellId) {
                return { statusCode: 400, body: JSON.stringify({ error: "Missing cellId" }) };
            }
            
            // Fetch current data
            const dataStr = await store.get("data");
            const data = dataStr ? JSON.parse(dataStr) : [];
            
            data.push({ cellId, timestamp });
            
            // Save updated data back to the blob
            await store.setJSON("data", data);
            
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "success" })
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
    };
};
