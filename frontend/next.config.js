module.exports = {
  images: {
    domains: ['user-images.githubusercontent.com'],
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
