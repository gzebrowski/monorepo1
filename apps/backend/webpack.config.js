const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve?.alias,
        '@prisma-admin/core': path.resolve(__dirname, '../../prisma-admin/packages/core/dist'),
        '@prisma-admin/nestjs': path.resolve(__dirname, '../../prisma-admin/packages/nestjs/dist'),
      },
      plugins: [
        ...(options.resolve?.plugins || []),
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
        }),
      ],
    },
    externals: {
      '@prisma/client': 'commonjs @prisma/client',
    },
  };
};
