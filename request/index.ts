import { MJMessage } from "midjourney";

const streamFetch = (url: string, body: string ,loading?: (uri: MJMessage) => void) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body,
  }) .then(async (response) => {
    const reader = response.body?.getReader();
    if (reader) {
      console.log('Response body is not null');
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        //Uint8Array to string
        const str = new TextDecoder("utf-8").decode(value);
        console.log(str);
        loading &&loading(JSON.parse(str))
      }
    } else {
       console.log('Response body is null');
    }
  });
}

export const Imagine = (body: string,loading?: (uri: MJMessage) => void) =>{
  return streamFetch('api/imagine',body,loading)
}

export const Upscale = (body: string,loading?: (uri: MJMessage) => void) =>{
  return streamFetch('api/upscale',body,loading)
}

export const Variation = (body: string,loading?: (uri: MJMessage) => void) =>{
  return streamFetch('api/upscale',body,loading)
}