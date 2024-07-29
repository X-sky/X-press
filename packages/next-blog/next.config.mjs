/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/X-resume",
  output: "export",
  reactStrictMode: true,
  trailingSlash: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "static.wixstatic.com",
      "assets-global.website-files.com",
    ],
  },
}

export default nextConfig
