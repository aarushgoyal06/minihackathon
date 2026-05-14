import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  output: isGithubPagesBuild ? "export" : undefined,
  basePath: pagesBasePath,
  trailingSlash: true,
};

export default nextConfig;
