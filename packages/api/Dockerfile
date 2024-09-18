# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY package.json .

# Install app dependencies
RUN npm i

# Copy the rest of the app's source code to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 3000
# Start the app
CMD ["node", "src/index.js"]
