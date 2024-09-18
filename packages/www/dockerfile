FROM node:alpine

WORKDIR /usr/src/app
ADD src src
ADD public public
ADD views views
ADD package.json ./

RUN npm install

CMD ["npm", "start"]