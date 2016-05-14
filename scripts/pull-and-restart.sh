#!/bin/sh

echo 'This script still needs to be ported!'
exit 1

if [ -z "$1" ]
then
  echo "Usage: $0 <branch-name>"
  exit 0
fi

# This may fail.
forever stop index.coffee

# Anything else should not.
set -e

git fetch
git checkout "$1"

export NODE_ENV=production

npm install
gulp dist

forever start -c ./node_modules/.bin/coffee index.coffee
