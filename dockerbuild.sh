#!/bin/bash -e
#export PATH=/usr/local/bin:/path/to/node:/path/to/node_bin:/path/to/phantomjs:/path/to/jscoverage:$PATH;

if [ "$1" == "" ]; then
	echo "Usage: ./dockerbuild.sh <docker username>"
	exit
fi

echo Cleaning...
rm -rf ./dist

if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)

echo Building app
npm install
bower install
grunt

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Grunt build failed with exit code " $rc
    exit $rc
fi

cat > ./dist/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

cat > ./dist/public/version.html << _EOF_
<!doctype html>
<head>
   <title>TicTacToe version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

cp ./Dockerfile ./dist/

cd dist
npm install --production
rc=$?
if [[ $rc != 0 ]] ; then
    echo "NPM install failed with exit code " $rc
    exit $rc
fi

echo Building docker image
docker build -t "$1"/tictactoe .

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

echo Pushing docker image
docker push "$1"/tictactoe:$GIT_COMMIT .
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi


echo "Done"
