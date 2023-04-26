
export const fetcherPost = (params: { url: "", body: "" }) => fetch(params.url, { method: "POST", body: params.body }).then((res) => res.json())
export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const fetcherMidjourney = (body: string) =>
  fetch('/api/midjourney', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body,
  })
.then((res) => res.json())