FROM node:16-alpine AS develop

WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine As production

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=develop /app/dist ./dist

EXPOSE 5001

CMD [ "npm", "run", "start:prod" ]
