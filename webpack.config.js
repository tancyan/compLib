// This config is for building dist files
const getWebpackConfig = require('./getWebpackConfig');

// noParse still leave `require('./locale' + name)` in dist files
// ignore is better
// http://stackoverflow.com/q/25384360


const webpackConfig = getWebpackConfig(false);


module.exports = webpackConfig;
