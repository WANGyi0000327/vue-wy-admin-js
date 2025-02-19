import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore(
  "user-auth",
  () => {
    const auth = ref("");
    const setAuth = authData => {
      auth.value = authData;
    };
    return {
      auth,
      setAuth
    };
  },
  {
    persist: {
      key: "auth-key"
    }
  }
);

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
