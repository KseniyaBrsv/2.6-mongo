FROM node:20.10-alpine

WORKDIR /app

ENV COUNTER_URL=counter:3001
COPY ./package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]