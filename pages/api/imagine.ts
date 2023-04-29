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
export const config = {
  runtime: "edge",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.body;
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      // controller.enqueue(
      //   encoder.encode(
      //     "<html><head><title>Vercel Edge Functions + Streaming</title></head><body>"
      //   )
      // );
      // controller.enqueue(encoder.encode("Vercel Edge Functions + Streaming"));
      // controller.enqueue(encoder.encode("</body></html>"));
      // controller.close();
      client
        .Imagine(prompt, (uri: string) => {
          console.log("imagine.loading", uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri })));
        })
        .then((msg) => {
          console.log("imagine.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("imagine.error", err);
          controller.close();
        });
    },
  });

  // console.log("imagine.start", prompt);
  // client
  //   .Imagine(prompt, (uri: string) => {
  //     console.log("imagine.loading", uri);
  //     const data = new TextEncoder().encode(JSON.stringify({ uri }));
  //     stream.push(data);
  //   })
  //   .then((msg) => {
  //     const data = new TextEncoder().encode(JSON.stringify(msg));
  //     console.log("imagine.done", msg);
  //     stream.push(data);
  //     stream.push(null);
  //   })
  //   .catch((err: ResponseError) => {
  //     console.log("imagine.error", err);
  //     stream.push(null);
  //   });
  return new Response(readable, {});
}
