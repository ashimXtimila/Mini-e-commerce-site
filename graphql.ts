// src/pages/api/graphql.ts (or pages/api/graphql.ts)
import { NextApiRequest, NextApiResponse } from 'next';

// 🚨🚨🚨 IMPORTANT: REPLACE THIS WITH YOUR REAL GRAPHQL BACKEND API URL 🚨🚨🚨
// Example: 'http://localhost:4000/graphql' or 'https://your-live-api.com/graphql'
const BACKEND_GRAPHQL_URL = 'YOUR_ACTUAL_BACKEND_GRAPHQL_ENDPOINT_HERE';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        // Only allow POST requests for GraphQL
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Forward the client's request to your actual backend GraphQL API
        const backendResponse = await fetch(BACKEND_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You might need to forward other headers like 'Authorization' if your API uses them
                // ...req.headers, // Use with caution, can forward unwanted headers
            },
            body: JSON.stringify(req.body), // Forward the GraphQL query body from the client
        });

        // Check if the backend response itself was not OK
        if (!backendResponse.ok) {
            const errorBody = await backendResponse.text(); // Read the error response from backend
            console.error('Backend GraphQL API responded with an error:', backendResponse.status, backendResponse.statusText, errorBody);
            // Forward the backend's status and response to the client
            return res.status(backendResponse.status).send(errorBody);
        }

        const data = await backendResponse.json(); // Parse the JSON response from the backend
        return res.status(200).json(data); // Send the data back to the client
    } catch (error) {
        console.error('Error in Next.js API proxy route:', error);
        // Generic server error if something goes wrong in the proxy itself
        return res.status(500).json({ message: 'Internal Server Error while processing GraphQL request.' });
    }
}