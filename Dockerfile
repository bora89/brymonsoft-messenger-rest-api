FROM node:current

WORKDIR /brymonsoft-messenger-rest-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]