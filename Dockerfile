FROM node:20.12.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["npm", "run", "start"]
