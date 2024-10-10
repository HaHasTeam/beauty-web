FROM node:20-alpine AS build
WORKDIR /app
COPY package-lock.yaml package.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install
COPY . .
RUN npm run build:docker

FROM nginx:alpine AS runtime
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3001