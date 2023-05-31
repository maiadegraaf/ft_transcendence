# Ft_transcendence - Online Pong Game

Welcome to ft_transcendence, a unique online platform where you can play the classic game of Pong against players from around the world! 
This web application was created as a part of our project assignment for 42 Intranet.

## Overview

This project involves the creation of a fully functional single page application website where users can play Pong with each other, in real-time. 
The application includes user authentication, a chat room, and a live multiplayer Pong game.

For this project, the following technologies were used:
- **NestJS**: A Node.js framework for building efficient, reliable, and scalable server-side applications.
- **VueJs**: A progressive framework for building user interfaces.
- **PostgreSQL**: A powerful, open source object-relational database system.
- **Docker**: A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.
- **Socket.io**: A JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers.
- **Pinia**: A Vue Store (inspired by Vuex) that automatically tracks dependencies and allows you to define stores without the boilerplate.
- **TypeORM**: An ORM that can run in NodeJS and can be used with TypeScript or JavaScript.
- **TypeScript**: A programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language.
- **HTML**: A markup language used for structuring and presenting content on the World Wide Web.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Bcrypt**: A password-hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher.
- **Axios**: A promise-based HTTP client for the browser and Node.js.
- **Passport**: An authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.


## Features

- **User Account**: Users can log in using the OAuth system of 42 intranet, choose a unique name, upload an avatar, enable two-factor authentication, and add other users as friends. They can also view their game stats, achievements, and match history.
- **Chat**: The chat system allows users to create public or private chat rooms, send direct messages, and block other users. The creator of a chat room has administrative privileges, including the ability to kick, ban, or mute other users.
- **Game**: The live Pong game allows users to play directly on the website. There's a matchmaking system that automatically matches users in a queue. Customization options like power-ups or different maps are also available.

## Security

All passwords stored in our database are hashed using bcrypt and the website is protected against SQL injections. We have implemented server-side validation for forms and user inputs.

## Usage

To run the website, you will need to have Docker installed and running on your machine.
Our website can be launched by a single call to: `docker-compose up --build`
Run the following command to launch the website:
```angular2html
make
```
The website will be available at `http://localhost:8080/`

In order to reset the docker containers and the database, run the following command:
```angular2html
make reset
```

## Compatibility

The website is compatible with the latest stable up-to-date version of Google Chrome and one additional web browser of your choice.
