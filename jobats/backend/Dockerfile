FROM node:18-alpine

WORKDIR /app

# Copy package files first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .
# Expose port
EXPOSE 5000

# Start command
CMD ["node", "server.js"]
