// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // keeping reactStrictMode off
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb', // set to 30 MB
    },
  },
};



export default nextConfig;
