# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /dist

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
