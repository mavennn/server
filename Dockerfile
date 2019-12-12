FROM node:latest
RUN mkdir -p /usr/src/index
WORKDIR /usr/src/index
COPY package.json /usr/src/index/
RUN npm install
COPY . /usr/src/index
EXPOSE 3000
CMD [ "npm", "index" ]
