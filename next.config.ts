/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "supreme-acoustics-a6998e70e5.media.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
