# Install dependencies only when needed
# Stage 0
FROM node:16-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN yarn install --frozen-lockfile
#############################################


# Copy Modules to Production
# Stage 1
FROM node:16 AS prod
WORKDIR /app

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app ./
COPY . .

EXPOSE 5000

RUN mkdir -p /etc/crontabs \ 
  && echo '0  0-21/3  *  *  * cd /app && node refresh' >> /etc/crontabs/root \
  && echo '0  1-22/3  *  *  * cd /app && node refresh' >> /etc/crontabs/root 

CMD ["yarn", "start"]
#############################################