'use strict';
const js = { 'test.js': 'test.js' };
const css = { 'style.css': 'test.css' };

module.exports = {
  options: {
    src: './',
    dst: './test'
  },

  'task:default': { js, css },

  'belt:js': {
    tools: [ 'src-rollup', 'dst-file' ]
  },

  'belt:css': {
    options: {
      postcss: {
        plugins: [ 'autoprefixer' ]
      }
    },
    tools: [ 'src-file', 'postcss', 'dst-file' ]
  }
};
