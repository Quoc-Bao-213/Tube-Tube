import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "image.mux.com",
      // },
      {
        protocol: "https",
        hostname: "kt2cj12ivi.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
