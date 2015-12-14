#!/bin/bash -e

if [ $# != 4 ]; then
	echo "Usage: ./dockerdeploy.sh <docker username> <ip address> <port in> <port out>"
	exit
fi

echo "______________________________________"

echo \(TestMachine\) Stopping and removing old processes
ssh "$2" 'docker stop $(docker ps -a -q)'
ssh "$2" 'docker rm $(docker ps -a -q)'
echo "______________________________________"

echo \(TestMachine\) Pulling docker image
ssh "$2" 'docker pull '$1'/tictactoe'
echo "______________________________________"

echo \(TestMachine\) Starting the new image
ssh "$2" 'docker run -p '$3:$4' -d -e "NODE_ENV=production" '$1'/tictactoe'
echo "______________________________________"

