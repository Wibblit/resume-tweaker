/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // keeping reactStrictMode off
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", // set to 30 MB
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*", // Apply headers to all routes
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none", // Disable COEP for YouTube compatibility
          },
        ],
      },
    ];
  },
};

export default nextConfig;
