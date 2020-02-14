#!/bin/bash
git checkout stage-online
npm run stage
git add *
git commit -a -m 'build stage'
git push origin stage-online
echo "测试环境构建上线结束"