import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // https://vuetifyjs.com/en/styles/colors/#material-colors
        primary: colors.blue.darken1,
        secondary: colors.blue.darken3,
        accent: colors.purple.base
      },
      dark: {
        primary: colors.blueGrey.darken3,
        secondary: colors.blueGrey.lighten2,
        accent: colors.pink.base
      }
    }
  }
})
