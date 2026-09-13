import { createApp } from 'vue'
import Lifecycle from './Lifecycle.vue'

const app = createApp(Lifecycle)
window.unmountVue = () => app.unmount()
app.mount('#root')
