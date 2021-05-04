module.exports = {
  images: {
    domains: ['user-images.githubusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/placeimg/:path*',
        destination: 'http://placeimg.com/:path*',
      },
    ]
  },
}
