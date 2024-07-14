FROM node AS builder
WORKDIR /
COPY package*.json /
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=builder /dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
LABEL authors="rokobata"a