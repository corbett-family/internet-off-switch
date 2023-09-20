FROM node:18-alpine

WORKDIR /usr/server/app
RUN apk add --no-cache tzdata curl
COPY ./ .
RUN yarn install; yarn run build
ENV NODE_ENV=production
CMD ["yarn", "run", "start"]
