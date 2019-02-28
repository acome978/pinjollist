/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

const withPlugins = require('next-compose-plugins');
const withTypescript = require('@zeit/next-typescript');
const withSourceMaps = require('@zeit/next-source-maps')();
const mdx = require('@zeit/next-mdx');
const rehypePrism = require('@mapbox/rehype-prism');

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    mdPlugins: [],
    hastPlugins: [rehypePrism],
  },
});

const nextConfig = {
  env: {
    GOOGLE_ANALYTICS: process.env['GOOGLE_ANALYTICS'],
  },
  // Read the `BUILD_TARGET` variable and use the passed mode
  exportPathMap: () => {
    return {
      '/': { page: '/' },
      '/search': { page: '/search' },
      '/api': { page: '/api' },
    };
  },
  target: process.env.BUILD_TARGET === 'server' ? 'server' : 'serverless',
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        defaultLoaders.babel,
        {
          loader: require('styled-jsx/webpack').loader,
          options: {
            type: fileName => (fileName.includes('node_modules') ? 'global' : 'scoped'),
          },
        },
      ],
    });

    return config;
  },
};

module.exports = withPlugins([[withTypescript], [withMDX]], nextConfig);
