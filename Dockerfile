FROM node:lts-alpine
WORKDIR /app
COPY ./dist /app/dist
COPY ./package.json /app/package.json
RUN npm install --omit=dev
CMD ["npm", "run", "start"]

