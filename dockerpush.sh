#!/bin/bash -e

if [ $# != 2 ]; then
	echo "Usage: ./dockerpush.sh <docker username> <ip address>"
	exit
fi

echo "______________________________________"

echo Pushing docker image
docker push "$1"/tictactoe
echo "______________________________________"

echo \(TestMachine\) Stopping and removing old processes
ssh "$2" 'docker stop $(docker ps -a -q)'
ssh "$2" 'docker rm $(docker ps -a -q)'
echo "______________________________________"

echo \(TestMachine\) Pulling docker image
ssh "$2" 'docker pull agirmar/tictactoe'
echo "______________________________________"

echo \(TestMachine\) Starting the new image
ssh "$2" 'docker run -p 9000:8080 -d -e "NODE_ENV=production" agirmar/tictactoe'
echo "______________________________________"

