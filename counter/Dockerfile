FROM node:20.10-alpine

WORKDIR /app
ENV STORAGE_URL=redis://storage:6379
COPY ./package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]