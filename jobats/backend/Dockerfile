FROM node:18-alpine

# Use /app as the folder INSIDE the container
WORKDIR /app

# Copy files from the CURRENT folder (.) to the container (.)
COPY package*.json ./
RUN npm install

# Copy everything else from the backend folder
COPY . .

# IMPORTANT: Ensure your server.js uses process.env.PORT
ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]