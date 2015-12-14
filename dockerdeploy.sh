#!/bin/bash -e

if [ $# != 5 ]; then
	echo "Usage: ./dockerdeploy.sh <docker username> <git revision> <ip address> <port in> <port out>"
	exit
fi

echo "Deploying revision '$2' of $1/tictactoe onto $3 $4:$5"
echo "______________________________________"

echo \(TestMachine\) Stopping and removing old processes
ssh "$3" 'docker stop $(docker ps -a -q)'
ssh "$3" 'docker rm $(docker ps -a -q)'
echo "______________________________________"

echo \(TestMachine\) Pulling docker image
ssh "$3" 'docker pull $1/tictactoe:$2'
echo "______________________________________"

echo \(TestMachine\) Starting the new image
ssh "$3" 'docker run -p $4:$5 -d -e "NODE_ENV=production" $1/tictactoe:$2'
echo "______________________________________"

