# ---- Build ----
FROM node:18-alpine AS build
WORKDIR /app
ADD . . 
RUN yarn 
RUN yarn build

# ---- Production ----
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/next.config.js ./next.config.js
RUN yarn install --prod
# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]