FROM node:8.1.2-alpine

ENV HOME=/usr/windbreaker-hooks

RUN mkdir -p $HOME

WORKDIR $HOME

# install git
RUN apk update && apk upgrade && \
  apk add --no-cache git

ADD package.json $HOME
RUN npm install --silent
