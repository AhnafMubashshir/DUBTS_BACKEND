FROM node:20.0.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6069
CMD ["npm", "start"]