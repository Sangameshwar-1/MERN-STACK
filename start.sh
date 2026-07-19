#!/bin/bash

# Start CacheX Engine in the background
echo "Starting CacheX Engine..."
cd /app/cachex
./cachex --server &
CACHEX_PID=$!

# Give CacheX a second to bind to the port
sleep 2

# Start Node.js Backend API in the foreground
echo "Starting Node.js Backend..."
cd /app/backend
node server.js &
NODE_PID=$!

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
