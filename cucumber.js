const common = [
    '--require-module ts-node/register',
    '--require support/**/*.ts',
    'features/**/*.feature'
  ].join(' ');
  
  module.exports = {
    default: common
  };
  