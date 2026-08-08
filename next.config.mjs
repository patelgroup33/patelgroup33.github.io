/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the whole site is client-side, so it ships as static files
  // (perfect for GitHub Pages). `next dev` is unaffected.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
