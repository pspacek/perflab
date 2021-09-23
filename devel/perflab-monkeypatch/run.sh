#!/bin/sh
# start web interface & agent at the same machine
# run by docker run
./perflab-httpd.js &
./perflab-tester.js
