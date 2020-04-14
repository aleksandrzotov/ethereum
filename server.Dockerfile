FROM node:12
WORKDIR /ethereum-server
COPY . .
RUN npm i
RUN npm i -g nodemon
CMD npm run start
