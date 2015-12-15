#!/bin/bash -e

if [ $# != 4 ]; then
	echo "Usage: ./dockerdeploy.sh <docker username> <git revision> <ip address> <port in>"
	exit
fi

echo "Deploying revision '$2' of $1/tictactoe onto $3 $4:8080"
echo "______________________________________"

echo \(TestMachine\) Stopping and removing old processes
currProcess=$(ssh $3 docker ps -f name=tictactoe$4 -q)
if [ ! -z "$currProcess" ]; then
	ssh "$3" 'docker stop '$currProcess''
	ssh "$3" 'docker rm '$currProcess''
fi
echo "______________________________________"

echo \(TestMachine\) Pulling docker image
ssh "$3" 'docker pull '$1'/tictactoe:'$2''
echo "______________________________________"

echo \(TestMachine\) Starting the new image
ssh "$3" 'docker run -p '$4':8080 -d --name tictactoe'$4' -e "NODE_ENV=production" '$1'/tictactoe:'$2''
echo "______________________________________"

