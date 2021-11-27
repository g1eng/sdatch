import {LicenseWebpackPlugin} from "license-webpack-plugin";
import TerserPlugin from 'terser-webpack-plugin'
import satisfies from 'spdx-satisfies';

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
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: (astNode, comment) => (comment.value.startsWith('! licenses are at '))
                    }
                }
            }),
        ]
    },
    mode: "development",
    watchOptions: {
        ignored: /(node_modules|.+\.spec\.js$|.+\.html)/
    },
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
    plugins: [
        new LicenseWebpackPlugin({
            licenseInclusionTest: (licenseType) => satisfies(licenseType, '(ISC OR MIT)'),
            renderLicenses: (modules) => {
                // console.log(modules[0].packageJson, modules[0].licenseId, modules[0].licenseText);
                return JSON.stringify(modules);
            },
            outputFilename: 'sdatch.licenses.txt',
            addBanner: true,
            renderBanner: (filename, modules) => {
                console.log(modules);
                return '/*! licenses for dependencies are at ' + filename + '*/';
            },
        })
    ]
};
