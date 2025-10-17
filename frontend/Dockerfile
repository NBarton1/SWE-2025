FROM node:jod-slim

WORKDIR /usr/src/

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev-exposed"]