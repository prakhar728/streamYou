/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

module.exports = {
    ...nextConfig,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://bafybeibgobcnfd2cfm7pamlevvniss7zyugolru27qlbbawrf57dnxpl64.ipfs.sphn.link/:path*',
            },
        ]
    }
}
