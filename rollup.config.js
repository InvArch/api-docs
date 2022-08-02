import merge from 'deepmerge';
import {createSpaConfig} from '@open-wc/building-rollup';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import summary from 'rollup-plugin-summary';
import serve from 'rollup-plugin-serve';

const baseConfig = createSpaConfig({
  developmentMode: process.env.ROLLUP_WATCH === 'true',
  injectServiceWorker: false,
});

function onwarn(warning) {
  if (warning.code !== 'THIS_IS_UNDEFINED') {
    console.error(`(!) ${warning.message}`);
  }
}

export default merge(baseConfig, {
  input: './index.html',
  plugins: [
    json(),
    commonjs(),
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    summary({}),
    replace({
      preventAssignment: true,
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    process.env.NODE_ENV === 'development' &&
      serve({
        contentBase: 'dist',
        host: 'localhost',
        port: 5000,
        historyApiFallback: true,
      }),
  ],
  external: ['websocket'],
  onwarn
});
