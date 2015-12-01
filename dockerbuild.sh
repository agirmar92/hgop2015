#!/bin/bash -e
export PATH=/usr/local/bin:/path/to/node:/path/to/node_bin:/path/to/phantomjs:/path/to/jscoverage:$PATH;

echo Cleaning...
rm -rf ./dist

echo Building app
npm install
bower install
grunt

cp ./Dockerfile ./dist/

cd dist
npm install --production

echo Building docker image
docker build -t agirmar/tictactoe .

echo "Done"
