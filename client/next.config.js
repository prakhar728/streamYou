/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
};

module.exports = {
    ...nextConfig,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://stream-you.vercel.app/api/:path*',
            },
        ]
    }
}
