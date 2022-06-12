FROM quay.io/souravkl11/raganork:multidevice

RUN git clone https://github.com/krakinz/raganork-md /skl/Raganork
WORKDIR /skl/Raganork
ENV TZ=Africa/Nairobi
RUN npm install supervisor -g
RUN yarn install --ignore-engines
CMD ["node", "index.js"]
