#!/bin/sh
# start web interface & agent at the same machine
# run by docker run
MAKEFLAGS="-j$(nproc)"
export MAKEFLAGS
./perflab-httpd.js &
./perflab-tester.js
