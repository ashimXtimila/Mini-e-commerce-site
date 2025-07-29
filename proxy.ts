import type { NextApiRequest, NextApiResponse } from 'next';

let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
        return res.status(200).json(cachedData);
    }

    try {
        const response = await fetch('https://freeapi.hashnode.space/api-guide/apireference/products');
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch external API' });
        }
        const data = await response.json();
        cachedData = data;      // Save data to cache
        lastFetchTime = now;    // Update cache time
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
