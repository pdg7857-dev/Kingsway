/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "16mb" },
    serverComponentsExternalPackages: ["unpdf", "mammoth", "adm-zip", "@anthropic-ai/sdk"],
  },
};

module.exports = nextConfig;
