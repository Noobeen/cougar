FROM node:20 AS build
WORKDIR /ui
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /ui/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]