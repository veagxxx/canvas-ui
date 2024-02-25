import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Painting from './components/painting';
import './assets/var.css';
const app = createApp(App);
app.use(Painting);
app.mount('#app');
