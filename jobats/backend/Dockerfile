FROM node:18-alpine
WORKDIR /app

# Since Render is already inside 'backend', 
# we copy files from the CURRENT directory (.)
COPY package*.json ./
RUN npm install
COPY . . 

# Use the port assigned by Render
ENV PORT=5000
EXPOSE ${PORT}

CMD ["node", "server.js"]