/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["antd"],
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/attachments/:path*",
        destination: "https://cdn.discordapp.com/attachments/:path*",
      },
      {
        source: "/ephemeral-attachments/:path*",
        destination: "https://cdn.discordapp.com/ephemeral-attachments/:path*",
      },
    ];
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_AUTH_NAME: process.env.NEXT_PUBLIC_AUTH_NAME || '',
    NEXT_PUBLIC_AUTH_CODE: process.env.NEXT_PUBLIC_AUTH_CODE || '',
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER || '',
  }
};

module.exports = nextConfig;
