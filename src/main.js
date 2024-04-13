import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueContentPlaceholders from '@fred78290/vue3-content-placeholders'
import '@fred78290/vue3-content-placeholders/style.css'

const app = createApp(App);

app.use(VueContentPlaceholders)
app.mount('#app');

