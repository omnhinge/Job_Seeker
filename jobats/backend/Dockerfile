FROM node:18-alpine
WORKDIR /app

# Since we are starting from the root, we point to the backend folder
COPY Job_Seeker/jobats/backend/package*.json ./
RUN npm install

# Copy all files from the backend folder into the container
COPY Job_Seeker/jobats/backend/ . 

ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]