# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /dist

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

COPY .next ./.next
COPY public ./public
COPY package*.json ./
COPY yarn.lock ./yarn.lock
COPY next.config.js ./next.config.js
# use npm ci for production
RUN yarn install --omit=dev
# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
