FROM docker.io/library/node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:server

FROM docker.io/library/node:22-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8765 PUBLIC_PORT=8765 LOG_DIR=/logs
COPY --from=build /app/dist-server/server.mjs /app/server.mjs
USER node
EXPOSE 8765
CMD ["node", "/app/server.mjs"]
