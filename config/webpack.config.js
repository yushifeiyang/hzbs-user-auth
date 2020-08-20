const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'userAuth.js',
		path: path.resolve(__dirname, '../dist'),
		library: "userAuth",
		libraryTarget: "umd",
		umdNamedDefine: true
	}
};