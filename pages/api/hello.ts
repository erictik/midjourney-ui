// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "../../interfaces";
import { Readable } from "stream";
const client = new Midjourney(
  <string>process.env.SERVER_ID,
  <string>process.env.CHANNEL_ID,
  <string>process.env.SALAI_TOKEN
);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  const stream = new Readable({
    read() {
      this.push(new TextEncoder().encode("hello"));
      setTimeout(() => {
        this.push(new TextEncoder().encode("world"));
        this.push(null);
      }, 1000);
    },
  });
  stream.pipe(res);
}
