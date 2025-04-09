import components from 'unplugin-vue-components/vite';
import {defineConfig} from 'vite';
import dns from 'node:dns';
import summary from 'rollup-plugin-summary';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath, URL} from 'node:url';
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';

dns.setDefaultResultOrder('ipv4first');

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
export default defineConfig(({mode}) => {
  const plugins = [
    vue({
      template: {transformAssetUrls}
    }),
    vuetify({
      autoImport: true
    }),
    components()
  ];
  // noinspection JSUnusedGlobalSymbols
  return {
    build: {
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vuetify')) {
                if (id.includes('blueprints')) {
                  return 'vuetify-blueprints';
                }
                if (id.includes('components')) {
                  return 'vuetify-components';
                }
                if (id.includes('composables')) {
                  return 'vuetify-composables';
                }
                if (id.includes('directives')) {
                  return 'vuetify-directives';
                }
                if (id.includes('iconssets')) {
                  return 'vuetify-iconssets';
                }
                if (id.includes('labs')) {
                  return 'vuetify-labs';
                }
                if (id.includes('locale')) {
                  return 'vuetify-locale';
                }
                if (id.includes('styles')) {
                  return 'vuetify-styles';
                }
                if (id.includes('util')) {
                  return 'vuetify-util';
                }
                return 'vuetify';
              }
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        },
        plugins: mode === 'production' ? [
          summary({
            showBrotliSize: true,
            showMinifiedSize: true,
            showGzippedSize: true
          })
        ] : []
      },
      sourcemap: mode !== 'production'
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    logLevel: mode === 'production' ? 'silent' : 'info',
    optimizeDeps: {
      exclude: ['fsevents'],
      include: ['vue']
    },
    plugins,
    preview: {
      open: false,
      port: 4173,
      strictPort: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue'
      ]
    },
    server: {
      hmr: true,
      logLevel: 'info',
      open: false,
      port: 5173,
      strictPort: true
    }
  };
});
