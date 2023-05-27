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
};

module.exports = nextConfig;
