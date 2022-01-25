import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
// import VueHtmlToPaper from 'vue-html-to-paper'

const app = createApp(App)
installElementPlus(app)
// app.use(VueHtmlToPaper)
app.mount('#app')