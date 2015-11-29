#!/bin/bash -e

echo "______________________________________"

echo Pushing docker image
docker push agirmar/tictactoe
echo "______________________________________"

echo \(TestMachine\) Stopping and removing old processes
ssh 192.168.33.10 'docker stop $(docker ps -a -q)'
ssh 192.168.33.10 'docker rm $(docker ps -a -q)'
echo "______________________________________"

echo \(TestMachine\) Pulling docker image
ssh 192.168.33.10 'docker pull agirmar/tictactoe'
echo "______________________________________"

echo \(TestMachine\) Starting the new image
ssh 192.168.33.10 'docker run -p 9000:8080 -d -e "NODE_ENV=production" agirmar/tictactoe'
echo "______________________________________"

echo "Done"
