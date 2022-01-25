import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import htmlToPdf from './plugins/htmlToPdf' //相对路径

// import VueHtmlToPaper from 'vue-html-to-pape
const app = createApp(App)
installElementPlus(app)
app.use(htmlToPdf)
app.mount('#app')