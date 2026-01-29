/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: '../app',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    // Use relative paths for assets - required for Electron file:// protocol
    assetPrefix: './',
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
    swcMinify: false, // Fix for SWC parser errors with some dependencies
};

module.exports = nextConfig;
