// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { content, index, msgId, msgHash } = req.body;
  console.log("variation.handler", content);
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: true,
    MaxWait: 600,
    Ws: true,
  });
  await client.init();
  const stream = new Readable({
    read() {},
  });

  client
    .Variation(
      content,
      index,
      msgId,
      msgHash,
      (uri: string, progress: string) => {
        console.log("variation.loading", uri);
        stream.push(JSON.stringify({ uri, progress }));
      }
    )
    .then((msg) => {
      console.log("variation.done", msg);
      stream.push(JSON.stringify(msg));
      stream.push(null);
    })
    .catch((err: ResponseError) => {
      console.log("variation.error", err);
      stream.push(null);
    });
  stream.pipe(res);
  // return new Response(readable, {});
};
export default handler;
