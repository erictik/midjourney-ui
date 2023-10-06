# midjourney-ui

Midjourney UI is an open source txt2img UI for AI draw

<div align="center">
	<p>
		<a href="https://discord.gg/GavuGHQbV4"><img src="https://img.shields.io/discord/1082500871478329374?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://hub.docker.com/r/erictik/midjourney-ui/tags">
		    <img src="https://img.shields.io/docker/v/erictik/midjourney-ui?color=5865F2&logo=docker&logoColor=white" alt="Docker" />
		</a>
	</p>
</div>

[discord bot example](https://github.com/erictik/midjourney-discord-wrapper/)

See [README.dev.md](README.dev.md) for development instructions.
See a screenshot of the UI
![screenshot](images/Screenshot.png)

## Deploy

#### Vercel

Host your own live version of Midjourney UI with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ferictik%2Fmidjourney-ui)
### Netlify
Netlify can use ws  

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/erictik/midjourney-ui)

#### Docker

```bash
docker run --env-file .env -p 3000:3000 erictik/midjourney-ui
```
or
```bash
docker run -e SALAI_TOKEN=xxxxxxxx  -e SERVER_ID=xxxxxxxx -e CHANNEL_ID=xxxxxxxx -p 3000:3000 erictik/midjourney-ui
```

## Runnning locally

1. clone the repo

```bash
git clone https://github.com/erictik/midjourney-ui.git
cd midjourney-ui
```

2. install dependencies

```bash
npm install
```

or

```bash
yarn
```

3. set the environment variables  
 [How to get your Discord SALAI_TOKEN](https://www.androidauthority.com/get-discord-token-3149920/)  
 [How to HUGGINGFACE_TOKEN](https://huggingface.co/docs/hub/security-tokens)  
 
```bash
export SALAI_TOKEN=xxxxxxxx
export SERVER_ID=xxxxxxxx
export CHANNEL_ID=xxxxxxxx
export HUGGINGFACE_TOKEN=xxx

```

4. run the development server

```bash
npm run dev
```

or

```bash
yarn dev
```

5. open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

```bash
# if needed
yarn install --frozen-lockfile

yarn build

docker build -t erictik/midjourney-ui
```

## Route map

- [x] imagine
- [x] upsclae & variation
- [ ] prompt help
- [ ] chatgpt prompt generation
- [x] history of generated images
- [x] Vary Region

## Enable Auth
1. No auth

No addition environment variables required.

2. Code
```bash
NEXT_PUBLIC_AUTH_PROVIDER=code
NEXT_PUBLIC_AUTH_CODE=123456
```
Input auth code to launch app
![code](./images/codelogin.png)

3. Netlify
```bash
export NEXT_PUBLIC_AUTH_PROVIDER=netlify
```
Need open netlify identity on netlify.

## Enable Vary Region
![Vary Region](./images/varyregion.png)
1. Local setting
```bash
# for macOS
export PUPPETEER_CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# for windows (Depends on your installation path)
export PUPPETEER_CHROME_BIN="C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
```

2. Docker

Add the follow content into `Dockerfile`, and rebuild docker image:
```Dockerfile
RUN apk add -q --update --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_CHROME_BIN="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
```

3. Netlify

Since the function has a 10s limit, it can't be called successfully.