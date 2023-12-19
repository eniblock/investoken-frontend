FROM node:20

WORKDIR /home/node/app

COPY package.json yarn.lock ./
COPY ./src/@iconify ./src/@iconify
COPY ./src/assets ./src/assets

RUN yarn

COPY . .

EXPOSE 8888

CMD ["npx", "netlify", "dev"]
