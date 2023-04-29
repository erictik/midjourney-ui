// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "../../interfaces";
import { Readable } from "stream";

export const config = {
  runtime: "edge",
};
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
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
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
  return new Response(readable, {});
}
