/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uploadthing.com", "lh3.googleusercontent.com", 'utfs.io'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
