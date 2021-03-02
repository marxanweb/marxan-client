# build environment  
FROM node:13.12.0-alpine as build  

ENV PATH node_modules/.bin:$PATH  
COPY package.json ./
COPY package-lock.json ./

RUN npm ci 
RUN npm install react-scripts@3.4.1 -g --silent  
COPY . ./
RUN npm run build  

FROM nginx:stable-alpine  
COPY --from=build /build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]