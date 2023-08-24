FROM node:alpine

WORKDIR /usr/app

RUN npm install -g ts-node-dev pino-pretty

COPY package.json ./

RUN npm install

ENV PATH /usr/app/node_modules/.bin:$PATH

COPY . /usr/app

EXPOSE 3001
