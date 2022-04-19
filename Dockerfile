FROM node:7.7.2-alpine
WORKDIR /usr/app

COPY ./source/package*.json ./

RUN npm install --quiet

COPY ./source .

# Install npm when the image starts. The compose file will set the 
# package.json and stuff to this folder already
#CMD ["/bin/bash", "-c", "npm install --quiet"]