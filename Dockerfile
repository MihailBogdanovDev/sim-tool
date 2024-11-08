FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY sim-tool ./sim-tool 
# CMD ["npm", "run", "start"]