// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let i = 0
  //Create a readable stream and send it every second. "tick"
  const stream = new Readable({
    read() {
      let sss = setInterval(() => {
        this.push(`tick ${i}\n`);
        i++;
        if (i > 3) {
          this.push(null);
          clearInterval(sss)
        }
      }, 1000);
    }
  });
  stream.pipe(res);
}
