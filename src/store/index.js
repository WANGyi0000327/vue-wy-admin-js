import { createPinia } from "pinia";
import persistedstate from "pinia-plugin-persistedstate";

const store = createPinia();
store.use(persistedstate);

export function setupStore(app) {
  app.use(store);
}

export { store };
