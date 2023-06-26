# Use a Node.js base image (Node.js 18)
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application code to the container
COPY . .

# Expose the port on which the Express.js application will run
EXPOSE 5000

# Start the Express.js application
CMD ["node", "src/index.js"]
