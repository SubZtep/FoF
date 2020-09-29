#!/usr/bin/env bash
target=dist
f1=aframe-v1.0.4.js
# f2=animation-mixer.js

cd `dirname "$BASH_SOURCE"`/..
cp node_modules/aframe/dist/$f1* $target
# cp node_modules/aframe-extras/src/loaders/$f2 $target
# printf "script(src=\"$f1\")\nscript(src=\"$f2\")" > $target/vendors.pug
printf "script(src=\"$f1\")" > $target/vendors.pug
