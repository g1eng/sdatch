export default {
    entry: './src/index.js',
    output: {
        filename: 'sdatch.js',
        library: {
            name: 'sdatch',
            type: "umd",
        },
    },
    optimization: {
        minimize: true
    },
    mode: "development",
    watchOptions: {
        ignored: /(node_modules|.+\.spec\.js$|.+\.html)/
    },
    // externals: {
    //     'd3-selection': {
    //         root: 'd3-selection',
    //     },
    //     'd3-array': {
    //         root: 'd3-array',
    //     },
    //     'd3-scale': {
    //         root: 'd3-scale',
    //     },
    //     'd3-shape': {
    //         root: 'd3-shape',
    //     },
    //     'd3-axis': {
    //         root: 'd3-axis',
    //     },
    //     'd3-transition': {
    //         root: 'd3-transition',
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    },
                },
                exclude: /node_modules/,
            }
        ]
    },
};
