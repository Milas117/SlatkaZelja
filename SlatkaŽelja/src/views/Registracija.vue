<template>
  <form @submit.prevent="submitForm" ref="registrationForm">
    <div class="container">
      <p><b>Popunite polja kako biste se registrirali</b></p>
      <hr>
      
      <div class="form-group">
        <label for="ime"><b>Ime</b></label>
        <input type="text" placeholder="Unesite ime" v-model="formData.ime" id="ime" required>
      </div>

      <div class="form-group">
        <label for="prezime"><b>Prezime</b></label>
        <input type="text" placeholder="Unesite prezime" v-model="formData.prezime" id="prezime" required>
      </div>

      <div class="form-group">
        <label for="korisnickoime"><b>Korisničko ime</b></label>
        <input type="text" placeholder="Unesite korisničko ime" v-model="formData.korisnickoime" id="korisnickoime" required>
      </div>

      <div class="form-group">
        <label for="email"><b>Email</b></label>
        <input type="email" placeholder="Unesite email" v-model="formData.email" id="email" required>
      </div>

      <div class="form-group">
        <label for="lozinka"><b>Lozinka</b></label>
        <input type="password" placeholder="Unesite lozinku" v-model="formData.lozinka" id="lozinka" required>
      </div>
      
      <div class="form-group">
        <label for="lozinkaPotvrda"><b>Potvrdi lozinku</b></label>
        <input type="password" placeholder="Potvrdi lozinku" v-model="formData.lozinkaPotvrda" id="lozinkaPotvrda" required>
      </div>

      <hr>

      <button type="submit" class="registerbtn">Registriraj</button>
    </div>

    <div class="container signin">
      <p>Već imaš račun? <router-link to="/Prijava">Prijavi se</router-link>.</p>
    </div>
  </form>

  <div v-if="successMessage" id="success-message" class="message-container">
    <p>{{ successMessage }}</p>
  </div>

  <div v-if="errorMessage" id="error-message" class="message-container" style="color: red;">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        ime: '',
        prezime: '',
        korisnickoime: '',
        email: '',
        lozinka: '',
        lozinkaPotvrda: ''
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    showMessage(message, success = true) {
      if (success) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = '';
          this.clearInputFields();
          if (success) {
            this.$router.push('/');
          }
        }, 3000);
      } else {
        this.errorMessage = message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    clearInputFields() {
      this.formData.ime = '';
      this.formData.prezime = '';
      this.formData.korisnickoime = '';
      this.formData.email = '';
      this.formData.lozinka = '';
      this.formData.lozinkaPotvrda = '';
    },
    submitForm() {
      const { email, lozinka, lozinkaPotvrda } = this.formData;

      if (!email.includes('@')) {
        this.showMessage('Molimo unesite ispravnu email adresu!', false);
        return;
      }
      if (lozinka !== lozinkaPotvrda) {
        this.showMessage('Lozinke se ne podudaraju. Molimo unesite iste lozinke.', false);
        return;
      }

      console.log('korisnicki podaci: ' , this.formData);
      fetch('http://localhost:3000/slatkaZelja/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(this.formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('korisnik', this.formData.korisnickoime);
        console.log(`User ${this.formData.korisnickoime} logged in.`);
        window.location.replace('/');
        this.showMessage(data.message, data.status);
      })
      .catch(error => {
        this.showMessage('Došlo je do greške prilikom registracije. Molimo pokušajte ponovno.', false);
      });
    }
  }
};
</script>

<style>
</style>
