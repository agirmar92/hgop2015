#!/bin/bash -e
#export PATH=/usr/local/bin:/path/to/node:/path/to/node_bin:/path/to/phantomjs:/path/to/jscoverage:$PATH;

if [ $# != 2 ]; then
	echo "Usage: ./acceptanceTests.sh <ip address> <port>"
	exit
fi

echo "______________________________________"
echo "Exporting api URL for testing = $1:$2"
export ACCEPTANCE_URL=http://$1:$2

echo "______________________________________"
echo "Running load/capacity tests"
grunt mochaTest:load

echo "______________________________________"
echo "Restarting server before next stage"
ssh $1 docker restart $(ssh $1 docker ps -q)

echo "______________________________________"
echo "Done"
