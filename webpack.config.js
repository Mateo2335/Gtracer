module.exports={
    entry: './src/app/index.js',
    output: {
        path: __dirname + '/src/public',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  { loader: 'file-loader' }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                        { loader: 'svg-inline-loader'}, 
                        { loader: 'svg-url-loader'},
                        { loader: '@svgr/webpack'},
                        { loader: 'react-svg-loader'}]
            }
                
        ]   
    }
};