<template>
  <form id="login-form" @submit.prevent="submitForm">
    <div class="container">
      <p><b>Upišite korisničko ime i lozinku kako bi ste se prijavili</b></p>
      <hr>
      <label for="korisnickoime"><b>Korisničko ime</b></label>
      <input type="text" placeholder="Unesite korisničko ime" v-model="formData.korisnickoime" id="korisnickoime" required>

      <label for="lozinka"><b>Lozinka</b></label>
      <input type="password" placeholder="Unesite lozinku" v-model="formData.lozinka" id="lozinka" required>

      <button type="submit">Prijava</button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        korisnickoime: '',
        lozinka: ''
      }
    };
  },
  methods: {
    submitForm() {
      fetch('http://localhost:3000/slatkaZelja/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        localStorage.setItem('korisnik', this.formData.korisnickoime);
        console.log('local storage: ', localStorage)
        console.log(`User ${this.formData.korisnickoime} logged in.`);
        window.location.replace('/');
        return response.json();
      })
      .catch(error => {
        alert('An error occurred: ' + error.message);
      });
    }
  }
};
</script>

<style>
@import '.././assets/Prijava.css';
</style>

