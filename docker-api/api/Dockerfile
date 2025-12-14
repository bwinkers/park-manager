# Example Dockerfile for simple Fastify API
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
