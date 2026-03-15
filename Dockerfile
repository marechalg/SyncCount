FROM node:25-alpine

WORKDIR /syncCount
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p data
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]