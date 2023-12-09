FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

ENTRYPOINT ["node", "dist/index.js"]
