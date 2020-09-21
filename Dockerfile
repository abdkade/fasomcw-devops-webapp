FROM node:alpine



WORKDIR /usr/src/app

COPY ["package.json","npm-shrinkwrap.json*","./"]


COPY . .

EXPOSE 3000

CMD ["npm", "start"]