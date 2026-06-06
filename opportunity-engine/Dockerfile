FROM node:20-bookworm-slim
WORKDIR /app

# Prisma needs openssl on Debian slim.
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate

EXPOSE 3000
# Overridden by docker-compose (which also runs db push + seed first).
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
