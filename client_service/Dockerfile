FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

RUN npm install -g pm2

CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
