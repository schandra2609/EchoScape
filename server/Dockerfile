# server/Dockerfile

# 1. Use the exact Node.js version with lightweight Alpine Linux distribution
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only the package files first to leverage Docker's layer caching
COPY package*.json .

# 4. Use npm ci (Clean Install) for strict, reproducible builds based on package-lock.json
RUN npm ci

# 5. Copy the rest of your backend source code (excluding items in .dockerignore)
COPY . .

# 6. Expose the port your Express server actually listens on (from your .env)
EXPOSE 5000

# 7. Start the server using the production script defined in your package.json
CMD ["npm", "start"]