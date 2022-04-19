FROM node:7.7.2-alpine
WORKDIR /usr/app

# Install npm when the image starts. The compose file will set the 
# package.json and stuff to this folder already
CMD ["/bin/bash", "-c", "npm install --quiet"]