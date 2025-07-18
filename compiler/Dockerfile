FROM node:22-alpine

WORKDIR /oj

# Use apt instead of apk
RUN apk update && apk add --no-cache g++ openjdk17-jdk python3

COPY . .

RUN npm install

EXPOSE 8000

CMD ["node", "server.js"]
