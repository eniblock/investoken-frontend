/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { createAuth0 } from '@auth0/auth0-vue'
import '@core/scss/template/index.scss'
import { GoogleDrive, NetworkEnum } from '@eniblock/sdk'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { IntlNumberFormats } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import eniblock from './plugins/eniblock'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
  }),
)
app.use(eniblock, {
  network: NetworkEnum.POLYGON_TESTNET_MUMBAI,
  appId: import.meta.env.VITE_ENIBLOCK_APP_ID,
  accessTokenProvider: () => app.config.globalProperties.$auth0.getAccessTokenSilently(),
  storageItems: [{ alias: import.meta.env.VITE_ENIBLOCK_ALIAS, storage: new GoogleDrive(import.meta.env.VITE_ENIBLOCK_GAPI_CLIENT_ID) }],
})

const numberFormats: IntlNumberFormats = {
  en: {
    currency: {
      style: 'currency', currency: 'EUR', notation: 'standard',
    },
    decimal: {
      style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2,
    },
    compact: {
      style: 'decimal', notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 0,
    },
    percent: {
      style: 'percent', useGrouping: false,
    },
  },
}

app.use(createI18n({ numberFormats }))

// Mount vue app
app.mount('#app')
