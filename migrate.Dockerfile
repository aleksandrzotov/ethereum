FROM node:12
WORKDIR /migrate
COPY . .
RUN npm i
CMD npm run db-migrate