FROM node:22-alpine

WORKDIR /oj

# Use apt instead of apk
RUN apk update && apk add --no-cache g++ 
COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]