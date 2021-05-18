module.exports = {
  images: {
    domains: ['user-images.githubusercontent.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/unsplash/:path*',
        destination: 'https://source.unsplash.com/:path*',
      },
    ]
  },
}
