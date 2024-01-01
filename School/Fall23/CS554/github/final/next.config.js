/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      pathname: '**'
    }, {
      protocol: 'http',
      hostname: '127.0.0.1',
      pathname: '**'
    }
    ]
  }
}

module.exports = nextConfig;