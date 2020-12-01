#!/usr/bin/env bash
target=dist
f1=aframe-v1.0.4.js
f2=animation-mixer.js
f3=aframe-sprite-component.js
f4=awt.min.js
f5=aframe-animation-timeline-component.js

cd `dirname "$BASH_SOURCE"`/..
cp node_modules/aframe/dist/$f1* $target
cp node_modules/aframe-extras/src/loaders/$f2 $target
cp node_modules/aframe-sprite-component/dist/$f3 $target

printf "script(src=\"$f1\")\n" > $target/vendors.pug
#printf "script(src=\"$f2\")\n" >> $target/vendors.pug
printf "script(src=\"$f3\")\n" >> $target/vendors.pug
printf "script(src=\"$f4\")\n" >> $target/vendors.pug
printf "script(src=\"$f5\")\n" >> $target/vendors.pug
