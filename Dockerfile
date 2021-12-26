FROM node:16-alpine3.11 AS node

FROM node AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . ./
RUN npm run build

FROM nginx:alpine AS final
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]