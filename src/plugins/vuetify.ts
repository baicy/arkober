// plugins/vuetify.js
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { md1 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { zhHans } from 'vuetify/locale'

export default createVuetify({
  blueprint: md1,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  locale: {
    locale: 'zhHans',
    messages: { zhHans }
  },
  theme: {
    defaultTheme: 'rhodes',
    themes: {
      rhodes: {
        dark: false,
        colors: {
          background: '#e8e8e8',
          surface: '#fcfcfc',
          primary: '#0098dc',
          secondary: '#313131',
          success: '#81ba52',
          warning: '#fbd401'
        }
      }
    }
  }
})
