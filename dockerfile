# Step 1: Use the official Node.js image as the base image

FROM node:latest

# Step 2: Set the working directory inside the container

WORKDIR /src/app

# Step 3: Copy package.json and package-lock.json (if exists) to install dependencies

COPY package*.json ./

# Step 4: Install the dependencies

RUN npm install

# Step 5: Copy the rest of the application code to the container

COPY . .

# Step 6: Build the TypeScript code

RUN npm run build

# Step 7: Expose the port that the app runs on (if necessary, specify the correct port)

EXPOSE 5000

# Step 8: Define the command to start your application

CMD [ "npm","run","dev" ]

