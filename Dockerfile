FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Ensure migrations and config are in dist
RUN cp -r migrations dist/migrations
RUN cp -r config dist/config

EXPOSE 3000

CMD ["sh", "-c", "npx sequelize-cli db:migrate --env production && npm run start"]
