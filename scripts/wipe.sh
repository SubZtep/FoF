#!/usr/bin/env bash

rm `ls dist/*.js | grep -v "aframe-warpspeed-texture"`
rm dist/*.map dist/*.html dist/vendors.pug package-lock.json
rm -rf node_modules
