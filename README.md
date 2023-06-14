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

## Route map

- [x] imagine
- [x] upsclae & variation
- [ ] prompt help
- [ ] chatgpt prompt generation
- [ ] history of generated images
