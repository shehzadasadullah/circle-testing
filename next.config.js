/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["mui-tel-input"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
