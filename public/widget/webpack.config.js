const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    // Получаем версию из package.json для версионирования
    const packageJson = require('./package.json');
    const widgetVersion = packageJson.version;

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: `widget.js`, // без версии в имени (чтобы ссылка была постоянной)
            library: 'CRMWidget',
            libraryTarget: 'umd',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        plugins: [
            // Добавляем переменную с версией виджета
            new webpack.DefinePlugin({
                'process.env.WIDGET_VERSION': JSON.stringify(widgetVersion),
            }),
        ],
        externals: {
            // Если хотите, чтобы react не включался в сборку (если он уже есть на сайте)
            // react: 'React',
            // 'react-dom': 'ReactDOM',
        },
        devtool: isProduction ? false : 'source-map',
    };
};