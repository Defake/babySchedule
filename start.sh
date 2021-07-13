#!/bin/bash
PORT=8081
echo "Application is served on http://localhost:$PORT"
python3 -m http.server --directory src $PORT