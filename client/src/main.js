import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // asigură-te că router.js are export default

const app = createApp(App);
app.use(router);
app.mount('#app'); // trebuie să existe <div id="app"></div> în index.html
