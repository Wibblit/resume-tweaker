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
        protocol: "https",
        hostname: "cdnresumetweaker.wibblit.com",
        pathname: "/**", // Allow all paths under this hostname
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
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://cdnresumetweaker.wibblit.com;",
          }
        ],
      },
    ];
  },
};



export default nextConfig;
