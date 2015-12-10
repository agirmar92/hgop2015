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
echo "Running acceptance tests"
grunt mochaTest:acceptance

echo "______________________________________"
echo "Done"
