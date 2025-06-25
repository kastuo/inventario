/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Evitar error "Can't resolve 'fs'" en bundle cliente
    if (!config.resolve.fallback) config.resolve.fallback = {};
    config.resolve.fallback.fs = false;
    config.resolve.fallback.path = false;
    config.resolve.fallback.os = false;
    return config;
  },
};

module.exports = nextConfig;