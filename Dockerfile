FROM node:18-alpine
WORKDIR /app

# Copy package files from the sub-folder
COPY jobats/backend/package*.json ./

RUN npm install

# Copy all the backend code from the sub-folder
COPY jobats/backend/ . 

# Use the port your server.js is listening on
EXPOSE 5000

CMD ["node", "server.js"]