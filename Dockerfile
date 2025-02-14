# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json, package-lock.json (or yarn.lock) to ensure the metadata is there
COPY package.json package-lock.json* ./

# Copy node_modules from the local machine into the container (skip npm install)
COPY node_modules ./node_modules

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Build the project
RUN npm run build

# Command to run the application
CMD ["npm", "start"]
