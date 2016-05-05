**Project:**<br> [![Build Status](https://travis-ci.org/Arisato/GreenHouse.svg?branch=master)](https://travis-ci.org/Arisato/GreenHouse)

You can access the Green House platform and the chat online at:

The Green House platform: http://188.166.158.80:7000/#/<br>
The online chat platform: http://188.166.158.80:7001<br>
The GitHub repository of this build: https://github.com/Arisato/GreenHouse.git

How to run this build on your local machine:

MongoDB database and NodeJS needs to be installed on the same
machine that will run this build and path’s to the following 
commands has to be declared globally, so you could call them
anywhere from the command prompt window.

Start your MongoDB database by typing this command into your
command line window: $ mongod

Once the database is running, on your command window you need
to navigate into the current folder where this readme is located
and run the server.js file with this command: $ node server

Once the database and server.js file is running, you can access
the platform by using this link: localhost:7000

To run the chat, navigate with the command prompt to greenhousechat
folder and run chatServer.js file with this command: $ node chatServer

Once the chatServer.js file is running you can access chat by using this
link: localhost:7001
