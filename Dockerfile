# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN yarn

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the application will run on (change as needed)
EXPOSE 3000

# Define the command to run your application
CMD ["node", "server.js"]
