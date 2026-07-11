FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ARG VITE_DEMO_MODE=false
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEMO_MODE=$VITE_DEMO_MODE
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:22-alpine
RUN npm install -g serve@14
COPY --from=build /app/dist /app/dist
WORKDIR /app/dist
EXPOSE 3000
CMD ["sh","-c","serve -s -l ${PORT:-3000}"]
