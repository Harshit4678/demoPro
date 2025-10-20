# ✅ 1. Use lightweight Node.js image
FROM node:18-alpine

# ✅ 2. Set working directory inside container
WORKDIR /app

# ✅ 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# ✅ 4. Copy rest of the source code
COPY . .

# ✅ 5. Set environment and expose port
ENV NODE_ENV=production
EXPOSE 5000

# ✅ 6. Start command
CMD ["node", "src/server.js"]
