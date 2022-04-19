FROM node:7.7.2-alpine
WORKDIR /usr/app

# Copy the package.json first so that npm installs correctly
COPY source/package.json .

# Install npm
RUN npm install --quiet

# Copy over all the files from the source directory to the server image
COPY source .