FROM node:lts-alpine3.17

WORKDIR /app

RUN npm i -g pnpm

COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY . ./

RUN pnpm install -r --offline \
    && pnpm -r build


EXPOSE 5004

CMD ["pnpm", "--filter", "main-ui", "serve"]
