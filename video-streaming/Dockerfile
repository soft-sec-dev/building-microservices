FROM node:18-alpine
WORKDIR /usr/src
COPY package*.json ./
RUN npm install 
COPY . .
CMD npm run dev