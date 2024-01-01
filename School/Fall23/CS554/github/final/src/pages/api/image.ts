// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getImageFromUrl } from '@/firebase/functions';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  imageUrl: string
}

// API route to get image from url
// takes in url as the firebase cloud storage url
// returns displayable url to that image
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    try{
        const {url} = req.query
        if(!url || typeof url !== 'string') throw 'No url provided'

        const imageUrl = await getImageFromUrl(url);
        // res.setHeader('Content-Type', 'image/jpeg');
        // res.setHeader('Allow-Cross-Origin', '*')
        return res.json({imageUrl});
    }
    catch(e) {
        console.error(e)
        throw e
    }
}
