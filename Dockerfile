FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/client ./client
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/socket ./socket
COPY --from=builder /app/app.js ./

RUN addgroup -S webrdp && adduser -S webrdp -G webrdp
RUN mkdir -p /app/screenshots && chown webrdp:webrdp /app/screenshots
USER webrdp

EXPOSE 4200

CMD ["node", "app.js"]
