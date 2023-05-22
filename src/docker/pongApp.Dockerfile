####################################################################################################
####################################################################################################

# Use the official Node.js image as the base image
FROM node:lts

# Install the dependencies
RUN apt-get update && apt-get install -y npm

WORKDIR /usr/src/app

COPY backend ./backend
#RUN rm -rf backend/node_modules backend/dist backend/secrets backend/test

COPY frontend ./frontend

COPY docker/startContainers.sh .
#RUN rm -rf frontend/node_modules frontend/dist

# Expose the port that the server will listen on
EXPOSE 8080

# Start the server
ENTRYPOINT ["sh", "startContainers.sh"]