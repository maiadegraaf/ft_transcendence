# FT_Transcendence - Online Pong Game

Welcome to ft_transcendence, a unique online platform where you can play the classic game of Pong against players from around the world! This web application was created as a part of our project assignment for 42 Intranet.

## Overview

This project involves the creation of a fully functional single page application website where users can play Pong with each other, in real-time. The application includes user authentication, a chat room, and a live multiplayer Pong game. It is built using NestJS for backend services, a TypeScript framework of our choice for the frontend, and PostgreSQL for the database.

## Features

- **User Account**: Users can log in using the OAuth system of 42 intranet, choose a unique name, upload an avatar, enable two-factor authentication, and add other users as friends. They can also view their game stats, achievements, and match history.
- **Chat**: The chat system allows users to create public or private chat rooms, send direct messages, and block other users. The creator of a chat room has administrative privileges, including the ability to kick, ban, or mute other users.
- **Game**: The live Pong game allows users to play directly on the website. There's a matchmaking system that automatically matches users in a queue. Customization options like power-ups or different maps are also available.

## Security

All passwords stored in our database are hashed and the website is protected against SQL injections. We have implemented server-side validation for forms and user inputs.

## Usage

To run the website, you will need to have Docker installed and running on your machine.
Our website can be launched by a single call to: `docker-compose up --build`
Run the following command to launch the website:
```angular2html
make
```
The website will be available at `http://localhost:8080/`

## Compatibility

The website is compatible with the latest stable up-to-date version of Google Chrome and one additional web browser of your choice.
