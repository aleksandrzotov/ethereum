FROM node:12
WORKDIR /init-db
COPY . .
RUN npm i
CMD npm run db-init