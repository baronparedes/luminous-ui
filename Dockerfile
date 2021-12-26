FROM node:16-alpine3.11 AS node

FROM node AS builder

ARG APP_API_URI
ARG APP_BRAND

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . ./
RUN echo "REACT_APP_API_URI=$APP_API_URI" >> .env
RUN echo "REACT_APP_BRAND=$APP_BRAND" >> .env
RUN npm run build

FROM nginx:alpine AS final
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]