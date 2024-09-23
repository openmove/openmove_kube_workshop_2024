FROM node:18
WORKDIR /home/node/app
#RUN chown -R node:node /home/node/app
ADD package.json package.json
ADD package-lock.json package-lock.json 
RUN npm i
COPY . .
EXPOSE 3000
#USER node
CMD ["node", "index.js"]
