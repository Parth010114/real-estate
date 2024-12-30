/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mpxfeimxqxsxkhoegttx.supabase.co',
                pathname: '/**', // Matches any path under the domain
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                pathname: '/**', // Matches any path under this domain
            },
        ],
    },
};

export default nextConfig;
