#! /usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
git commit -m 'new deployment:get single post fix:4'
git push -f git@github.com:barantoro/koro.git main:gh-pages

cd -