FROM node:20-bookworm

RUN apt-get update && apt-get install -y \
    python3 \
    python-is-python3 \
    openjdk-17-jdk-headless \
    gcc \
    g++ \
    golang \
    rustc \
    ruby \
    php-cli \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install --no-save typescript ts-node

COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "src/server.js"]
