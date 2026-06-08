FROM node:20-bookworm-slim
WORKDIR /app

# openssl for Prisma; tesseract + poppler for OCR of scanned PDFs (#4).
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates tesseract-ocr poppler-utils \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
# Copy the Prisma schema before install so the postinstall `prisma generate`
# (and other install scripts, e.g. esbuild) can run.
COPY prisma ./prisma
RUN npm install
COPY . .
RUN npx prisma generate

EXPOSE 3000
# Overridden by docker-compose (which also runs db push + seed first).
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
