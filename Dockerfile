FROM node:18-alpine
WORKDIR /agenda-back
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 80
CMD yarn dev