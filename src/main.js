import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { VueRecaptcha } from 'vue-recaptcha'
import mitt from 'mitt';

const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.emitter = emitter
app.use(VueRecaptcha, {
    sitekey: '6LfVK3cpAAAAAIciRS8j6ea-3mgTG1aOAGBmq-XB',
})
app.mount('#app')