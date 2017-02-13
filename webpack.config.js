const path = require("path")

module.exports = {
    entry: {
        "app": ["./index.tsx"],
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
        filename: "assets.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["awesome-typescript-loader"],
            },
        ],
    },
}

