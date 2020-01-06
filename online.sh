#!/bin/bash
npm run prod
git add *
git commit -a -m 'build onlie'
git push origin online
echo "构建结束并上线"