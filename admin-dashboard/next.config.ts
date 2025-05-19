// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: "standalone",
//   env: {
//     NEXT_PUBLIC_API_URL:
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:3344",
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3344"}/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api:3344/:path*", // Proxy para o backend
      },
    ];
  },
};

module.exports = nextConfig;
