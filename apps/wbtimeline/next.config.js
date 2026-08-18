/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    turbopack: {
        rules: {
            "*.yaml": {
                loaders: ["yaml-loader"],
                as: "*.js",
            },
        },
    },
}

export default nextConfig
