FROM alpine:latest

# Install C++ Build Tools and Node.js
RUN apk add --no-cache cmake make g++ python3 nodejs npm bash

WORKDIR /app

# --- Build CacheX Engine ---
COPY cachex /app/cachex
WORKDIR /app/cachex
RUN cmake . && make

# --- Setup Node.js Backend ---
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# --- Setup Orchestration ---
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Expose ONLY the Node.js API port (CacheX is private to localhost)
EXPOSE 5000

CMD ["./start.sh"]
