####################################################################################################
####################################################################################################

# Use the official Node.js image as the base image
FROM node:lts

# Install the dependencies
RUN apt-get update && apt-get install -y npm

WORKDIR /usr/src/app

COPY backend ./backend
RUN npm install --prefix backend
RUN npm run build --prefix backend

COPY frontend ./frontend
RUN npm install --prefix frontend
RUN npm run build --prefix frontend

# Expose the port that the server will listen on
EXPOSE 8080

# Start the server
ENTRYPOINT ["npm", "run", "start:prod", "--prefix", "backend"]