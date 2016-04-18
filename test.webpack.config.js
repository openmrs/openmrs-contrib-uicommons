require('angular');
require('angular-mocks');

var srcContext = require.context('./angular/.', true,  /\.js$/);
srcContext.keys().forEach(srcContext);