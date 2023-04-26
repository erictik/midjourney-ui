// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {  MJMessage, Midjourney } from 'midjourney'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseError } from '../../interfaces'
const client = new Midjourney(<string>process.env.SERVER_ID, <string>process.env.CHANNEL_ID, <string>process.env.SALAI_TOKEN)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse< MJMessage | ResponseError>
) {
    const { prompt } = req.body
    const msg = await client.Imagine(prompt, (uri: string) => {
      console.log("loading", uri)
    })
    if(!msg){ 
      res.status(500).json({message: "Something went wrong"})
      return
    }
    res.status(200).json(msg)
}
