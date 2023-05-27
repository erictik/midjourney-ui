// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
export const config = {
  runtime: "serverless",
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: true,
    MaxWait: 600,
    Ws: true,
  });
  await client.init();
  console.log("imagine.handler", req.body);
  const { prompt } = req.body;
  const stream = new Readable({
    read() {},
  });
  console.log("imagine.start", prompt);
  client
    .Imagine(prompt, (uri: string, progress: string) => {
      console.log("imagine.loading", uri, progress);
      stream.push(JSON.stringify({ uri, progress }));
    })
    .then((msg) => {
      console.log("imagine.done", msg);
      stream.push(JSON.stringify(msg));
      stream.push(null);
    })
    .catch((err: ResponseError) => {
      console.log("imagine.error", err);
      stream.push(null);
    });
  stream.pipe(res);
  console.log("imagine.handler", prompt);
  // const encoder = new TextEncoder();
  // const readable = new ReadableStream({
  //   start(controller) {
  //     console.log("imagine.start", prompt);
  //     client
  //       .Imagine(prompt, (uri: string, progress: string) => {
  //         console.log("imagine.loading", uri);
  //         controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
  //       })
  //       .then((msg) => {
  //         console.log("imagine.done", msg);
  //         controller.enqueue(encoder.encode(JSON.stringify(msg)));
  //         controller.close();
  //       })
  //       .catch((err: ResponseError) => {
  //         console.log("imagine.error", err);
  //         controller.close();
  //       });
  //   },
  // });

  // res;

  // return new Response(readable, {});
};
export default handler;
