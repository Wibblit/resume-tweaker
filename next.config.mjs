/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer', 'puppeteer-core');
    }

    // Exclude chrome-aws-lambda from being processed by webpack
    config.externals.push('chrome-aws-lambda');

    // Handle .node files
    config.resolve.extensions.push('.node');

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Ignore warnings for chrome-aws-lambda
    config.ignoreWarnings = [
      { module: /node_modules\/chrome-aws-lambda/ },
    ];

    return config;
  },
};

export default nextConfig;