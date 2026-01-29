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
};

module.exports = nextConfig;
