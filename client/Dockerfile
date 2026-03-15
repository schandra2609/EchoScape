# client/Dockerfile

# ==========================================
# STAGE 1: Build the React/Vite Application
# ==========================================
# 1. Use your exact Node version
FROM node:22-alpine AS builder

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# 4. Copy the rest of the frontend source code
COPY . .

# 5. Build the production-ready static files (outputs to /app/dist)
RUN npm run build

# ==========================================
# STAGE 2: Serve the App with Nginx
# ==========================================
# 6. Use a lightweight Nginx image
FROM nginx:alpine

# 7. Copy the built files from the "builder" stage into Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. CRITICAL: Configure Nginx to handle React Router (SPA Fallback)
# This ensures that refreshing a page like /insights doesn't return a 404 error
RUN sed -i '10i \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

# 9. Expose port 80 (standard HTTP port)
EXPOSE 80

# 10. Start Nginx
CMD ["nginx", "-g", "daemon off;"]