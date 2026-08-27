/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las mascotas se publican con una URL de imagen libre (pegada por el refugio),
    // así que permitimos cualquier host https además de la API de razas y Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
