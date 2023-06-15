// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
export const config = {
  runtime: "edge",
};
export default async function handler(req: Request) {
  const { content, index, msgId, msgHash } = await req.json();
  console.log("variation.handler", content);
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN,
    Debug: true,
    Ws: process.env.WS === "true",
  });
  await client.init();
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log("variation.start", content);
      client
        .Variation(
          content,
          index,
          msgId,
          msgHash,
          (uri: string, progress: string) => {
            console.log("variation.loading", uri);
            controller.enqueue(
              encoder.encode(JSON.stringify({ uri, progress }))
            );
          }
        )
        .then((msg) => {
          console.log("variation.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          client.Close();
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("variation.error", err);
          client.Close();
          controller.close();
        });
    },
  });
  return new Response(readable, {});
}
