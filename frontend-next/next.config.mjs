/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,

  /*
   * Flat → Apartments: purane /properties/flat/... URLs naye
   * /properties/apartments/... par permanent (301/308) redirect,
   * taake Google ke purane links 404 na dein.
   */
  async redirects() {
    return [
      {
        source: '/properties/flat',
        destination: '/properties/apartments/',
        permanent: true,
      },
      {
        source: '/properties/flat/:path*',
        destination: '/properties/apartments/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;