import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import colours from 'vuetify/util/colors';
import {createVuetify} from 'vuetify';
import {websiteConfigThemeModeGet} from '@/components/functions/cookies.js';

export default createVuetify({
  defaults: {
    VAppBar: {
      color: 'transparent'
    },
    VBtn: {
      color: 'success',
      density: 'comfortable',
      rounded: 'lg',
      style: {
        textTransform: 'none'
      },
      variant: 'flat'
    },
    VCardActions: {
      VBtn: {
        color: 'success',
        density: 'comfortable',
        rounded: 'lg',
        style: {
          textTransform: 'none'
        },
        variant: 'flat'
      }
    },
    VExpansionPanels: {},
    VToolbar: {
      color: 'primary'
    }
  },
  icons: {
    defaultSet: 'mdi'
  },
  theme: {
    defaultTheme: websiteConfigThemeModeGet() || 'dark',
    themes: {
      dark: {
        background: colours.grey.darken4,
        colors: {
          accent: colours.purple.base,
          buttonAction: colours.orange.lighten2,
          buttonDisabled: colours.grey.lighten1,
          error: colours.red.base,
          errorSecondary: colours.red.lighten2,
          errorTertiary: colours.red.lighten3,
          info: colours.blue.base,
          primary: colours.blue.base,
          secondary: colours.blue.lighten2,
          slightlyVisible: colours.grey.darken3,
          success: colours.green.base,
          successSecondary: colours.green.darken2,
          tertiary: colours.blue.lighten3,
          warning: colours.orange.base,
          warningSecondary: colours.orange.lighten2
        },
        dark: true
      },
      light: {
        background: colours.grey.lighten5,
        colors: {
          accent: colours.purple.base,
          error: colours.red.base,
          errorSecondary: colours.red.lighten2,
          info: colours.blue.base,
          primary: colours.blue.base,
          secondary: colours.blue.lighten2,
          slightlyVisible: colours.grey.darken1,
          success: colours.green.base,
          tertiary: colours.blue.lighten3,
          warning: colours.orange.base,
          warningSecondary: colours.orange.lighten2
        },
        dark: false
      }
    }
  }
});
