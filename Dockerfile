FROM node:18-alpine
WORKDIR /agenda
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 80
CMD yarn dev