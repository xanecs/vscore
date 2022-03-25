import Logging from './Logging.svelte'

const app = new Logging({
  target: document.getElementById('app')
})

export default app
