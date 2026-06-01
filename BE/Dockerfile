FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY BE/package*.json ./
RUN npm ci --only=production

# Copy application source
COPY BE/ .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
