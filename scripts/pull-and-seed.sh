#!/bin/sh

echo 'This script still needs to be ported!'
exit 1

if [ -z "$1" ]
then
  echo "Usage: $0 <branch-name>"
  exit 0
fi

set -e

git fetch
git checkout "$1"

export NODE_ENV=production

npm install

./node_modules/.bin/coffee scripts/seed-database.coffee --force --include-custom-recipes
