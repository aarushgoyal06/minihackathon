import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: isGithubPagesBuild ? "export" : undefined,
  basePath: process.env.PAGES_BASE_PATH,
  trailingSlash: true,
};

export default nextConfig;
