// src/state.js
import { reactive } from 'vue';

export const state = reactive({
  isLoggedIn: false,
  korisnik: '',
});
