// @ts-check
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  // We already do linting on GH actions
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
};

export default config;
