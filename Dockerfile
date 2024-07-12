FROM node:alpine3.20 as base-stage
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

FROM base-stage as build-stage
WORKDIR /usr/app
COPY . .
RUN npm run build

FROM node:alpine3.20 as final-stage
WORKDIR /usr/app
COPY --from=build-stage /usr/app/node_modules ./node_modules
COPY --from=build-stage /usr/app/dist ./dist
CMD [ "node", "./dist/src/main.js" ]