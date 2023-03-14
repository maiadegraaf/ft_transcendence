####################################################################################################
# THIS IS TOTALLY COPIED FROM CHATGPT3 :)
####################################################################################################

# Use the official Node.js image as the base image
FROM node:lts

# Install the dependencies
RUN apt-get update && apt-get install -y npm

# Install the project dependencies
RUN npm install -g @nestjs/cli

# Set the working directory in the container
WORKDIR /app

# Expose the port that the server will listen on
EXPOSE 3000

# Start the server
ENTRYPOINT [ "npm", "run", "start"]