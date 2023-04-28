// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from 'midjourney'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseError } from '../../interfaces'
import { Readable } from 'stream'
const client = new Midjourney(<string>process.env.SERVER_ID, <string>process.env.CHANNEL_ID, <string>process.env.SALAI_TOKEN)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, index, msgId, msgHash } = req.body
  const stream = new Readable({
    read() {

    }
  });
  console.log("variation.start", prompt)
  client.Variation(content, index, msgId, msgHash, (uri: string) => {
    console.log("variation.loading", uri)
    stream.push(JSON.stringify({ uri }))
  }).then((msg) => {
    console.log("variation.done", msg)
    stream.push(JSON.stringify(msg))
    stream.push(null)
  }).catch((err: ResponseError) => {
    console.log("variation.error", err)
    stream.push(null)
  })
  stream.pipe(res);
}
