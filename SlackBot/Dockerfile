FROM node:10
RUN mkdir /app
ADD . /app
WORKDIR /app
ENV NODE_ENV=production
RUN npm install

EXPOSE 8000
CMD ["npm", "start"]