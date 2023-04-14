FROM node:16.14.2
WORKDIR /
COPY package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 5000
CMD ["npm","start"]