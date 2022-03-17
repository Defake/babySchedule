#!/bin/bash
PORT=8881
echo "Application is served on http://localhost:$PORT"
python3 -m http.server --directory src $PORT