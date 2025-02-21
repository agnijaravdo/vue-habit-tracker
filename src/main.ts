import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
// @ts-expect-error: Aura module has no default export but it's a valid import
import Aura from '@primevue/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app
  .use(router)
  .use(ConfirmationService)
  .use(PrimeVue, {
    theme: {
      preset: definePreset(Aura, {})
    }
  })

app.mount('#app')
