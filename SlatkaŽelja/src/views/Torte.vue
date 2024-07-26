<template>
    <div>
      <div class="modal fade" id="userDetailsModal" tabindex="-1" role="dialog" aria-labelledby="userDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="userDetailsModalLabel">Korisnički Podaci</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeUserDetailsModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="userDetailsForm">
                <div class="form-group">
                  <label for="username">Korisničko Ime</label>
                  <input type="text" class="form-control" id="username" v-model="userDetails.username" disabled>
                </div>
                <div class="form-group">
                  <label for="firstName">Ime</label>
                  <input type="text" class="form-control" id="firstName" v-model="userDetails.firstName" readonly>
                </div>
                <div class="form-group">
                  <label for="lastName">Prezime</label>
                  <input type="text" class="form-control" id="lastName" v-model="userDetails.lastName" readonly>
                </div>
                <div class="form-group">
                  <label for="oldPassword">Stara Lozinka</label>
                  <input type="password" class="form-control" id="oldPassword" v-model="userDetails.oldPassword">
                </div>
                <div class="form-group">
                  <label for="newPassword">Nova Lozinka</label>
                  <input type="password" class="form-control" id="newPassword" v-model="userDetails.newPassword">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeUserDetailsModal">Zatvori</button>
              <button type="button" class="btn btn-primary" @click="updateUserDetails">Spremi Promjene</button>
            </div>
          </div>
        </div>
      </div></div>
  
      <div class="image-container">
        <h1>Pošaljite nam sliku i opis torte kakvu želite da Vam napravimo</h1>
        <img src="../assets/images/Torta2.jpeg" alt="Opis slike 1">
        <button class="image-button" @click="openImageFormModal">Pošaljite sliku svoje torte</button>
      </div>
      <div class="image-container">
        <h1>Želite jedinstvenu tortu? Kreirajte ju sami, a mi je pravimo!</h1>
        <img src="../assets/images/Torta.jpg" alt="Opis slike 2">
        <button class="image-button" @click="openModal">Personalizirajte svoju tortu</button>
      </div>
  
      <div id="myModal" class="modal" ref="createCakeModal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <div class="forms-wrapper">
            <form @submit.prevent="submitSelection">
              <div class="container1">
                <h1>Odaberite sastojke i kreirajte svoju tortu!</h1>
                <label for="shape">Odaberi oblik torte:</label>
                <select id="shape" v-model="cakeShape" @change="updateCakeShape">
                  <option value="" disabled selected>Odaberite oblik</option>
                  <option value="Okrugla">Okrugla</option>
                  <option value="Pravokutna">Pravokutna</option>
                </select>
  
                <label for="size">Odaberite veličinu torte:</label>
                <select id="size" v-model="cakeSize" @change="updateCakeSize">
                  <option value="" disabled selected>Odaberite veličinu</option>
                  <option value="Mala">Mala 15cm</option>
                  <option value="Srednja">Srednja 25cm</option>
                  <option value="Velika">Velika 35cm</option>
                </select>
  
                <label for="color">Odaberite boju torte:</label>
                <input type="color" id="color" v-model="cakeColor" @change="updateCakeColor">
  
                <div id="preview">
                  <svg width="300" height="300" viewBox="0 0 300 300">
                    <circle v-show="cakeShape === 'Okrugla'" :fill="cakeColor" cx="150" cy="150" r="100"></circle>
                    <rect v-show="cakeShape === 'Pravokutna'" :fill="cakeColor" x="50" y="50" width="200" height="200"></rect>
                  </svg>
                </div>
  
                <label for="biscuit">Odaberite biskvit torte:</label>
                <select id="biscuit" v-model="cakeBiscuit" @change="updateCakeBiscuit">
                  <option value="" disabled selected>Odaberite biskvit</option>
                  <option value="Jaja">Biskvit od jaja</option>
                  <option value="Badem">Biskvit od badema</option>
                  <option value="Orah">Biskvit od oraha</option>
                </select>
  
                <label for="cream">Odaberite kremu:</label>
                <select id="cream" v-model="cakeCream" @change="updateCakeCream">
                  <option value="" disabled selected>Odaberi kremu</option>
                  <option value="nutella">Krema Nutella</option>
                  <option value="Pehar">Krema Pehar</option>
                  <option value="Jogurtica">Krema Jogurtica</option>
                  <option value="Šlag">Šlag</option>
                </select>
  
                <label for="kat">Odaberite broj katova torte:</label>
                <select id="kat" v-model="cakeLayers" @change="updateCakeLayers">
                  <option value="" disabled selected>Odaberite broj katova</option>
                  <option value="JedanKat">1 kat</option>
                  <option value="DvaKata">2 kata</option>
                  <option value="TriKata">3 kata</option>
                </select>
  
                <label for="birthday">Torta za rođendan:</label>
                <input type="checkbox" id="birthday" v-model="isBirthdayCake" @change="toggleBirthdayOptions">
                <div v-show="isBirthdayCake">
                  <label for="age">Broj svjećica:</label>
                  <input type="number" id="age" v-model="birthdayCandles" min="1" @change="updateBirthdayCandles">
                  <button type="button" @click="addCandles">Dodaj</button>
                </div>
  
                <p id="totalPrice">Ukupna cijena: {{ totalPrice }} EUR</p>
                <label for="pickupDate">Datum preuzimanja:</label>
                <input type="date" id="pickupDate" v-model="pickupDate" >
  
                <button type="submit">Potvrdite odabir</button>
                <button type="button" class="btn btn-secondary" @click="closeModal">Odustani</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <div id="imageFormModal" class="modal" ref="imageFormModal">
      <div class="modal-content">
        <form @submit.prevent="submitImageForm">
          <h1>Pošaljite nam tortu kakva želite da izgleda!</h1>
          <div>
            <label for="image">Odaberite sliku:</label>
            <input type="file" name="image" id="image" @change="handleFileChange" required>
          </div>
          <div>
            <label for="comment">Napišite sve što trebamo znati o torti</label>
            <textarea name="comment" id="comment" v-model="imageComment" rows="4" cols="50"></textarea>
          </div>
          <div>
            <label for="pickupDate">Datum preuzimanja:</label>
            <input type="date" id="pickupDate1" v-model="imagePickupDate" required>
          </div>
          <button type="submit">Upload</button>
          <button type="button" class="btn btn-secondary" @click="closeImageModal">Odustani</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: false,
        korisnik: '',
        storedUser: '',
        userId: '',
        userDetails: {
          username: '',
          firstName: '',
          lastName: '',
          oldPassword: '',
          newPassword: ''
        },
        cakeShape: '',
        cakeSize: '',
        cakeColor: '#ffffff',
        cakeBiscuit: '',
        cakeCream: '',
        cakeLayers: '',
        isBirthdayCake: false,
        birthdayCandles: 0,
        pickupDate: '',
        totalPrice: 0,
        imageFile: null,
        imageComment: '',
        imagePickupDate: ''
      };
    },
    methods: {
      checkLoginStatus() {
        fetch('http://localhost:3000/session-status')
          .then(response => response.json())
          .then(data => {
            this.isLoggedIn = data.loggedIn;
            this.korisnik = data.korisnik;
          });
      },
      fetchUserDetails() {
        fetch('http://localhost:3000/get-user-details')
          .then(response => response.json())
          .then(data => {
            this.userDetails.username = data.korisnickoime;
            this.userDetails.firstName = data.ime;
            this.userDetails.lastName = data.prezime;
            this.$refs.userDetailsModal.show();
          });
      },
      fetchCurrentUserDetails(){
        this.storedUser = localStorage.getItem('korisnik');
      console.log(this.storedUser);
      
        if (this.storedUser) {
          
          const userName = this.storedUser; 

            fetch(`http://localhost:3000/get-user-details/${userName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User Details:', data);
                    console.log('user ID: ', data.user._id)
                    this.userId = data.user._id;
                    console.log(this.userId);
                    this.userDetails = data;
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        } else {
            console.warn('No user found in local storage');
        }
      },
      async submitSelection() {
      
    },
      updateUserDetails() {
        const userDetails = {
          oldPassword: this.userDetails.oldPassword,
          newPassword: this.userDetails.newPassword
        };
        fetch('http://localhost:3000/update-user-password', {
        
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userDetails)
        })
        .then(response => {
          if (response.ok) {
            alert('Lozinka je ažurirana!');
            this.closeUserDetailsModal();
          } else {
            throw new Error('Došlo je do greške pri promjeni lozinke.');
          }
        })
        .catch(error => alert(error.message));
      },
      closeUserDetailsModal() {
        this.$refs.userDetailsModal.hide();
      },
      openModal() {
        this.$refs.createCakeModal.style.display = 'block';
      },
      closeModal() {
        this.$refs.createCakeModal.style.display = 'none';
      },
      openImageFormModal() {
        this.$refs.imageFormModal.style.display = 'block';
      },
      closeImageModal() {
        this.$refs.imageFormModal.style.display = 'none';
      },
      async submitSelection() {
        console.log("HI?")
      console.log('Cake shape:', this.cakeShape);
      console.log('Cake size:', this.cakeSize);
      console.log('Cake color:', this.cakeColor);
      console.log('Cake biscuit:', this.cakeBiscuit);
      console.log('Cake cream:', this.cakeCream);
      console.log('Cake layers:', this.cakeLayers);
      console.log('Is birthday cake:', this.isBirthdayCake);
      console.log('Birthday candles:', this.birthdayCandles);
      console.log('Pickup date:', this.pickupDate);

      const cakeData = {
        shape: this.cakeShape,
        size: this.cakeSize,
        color: this.cakeColor,
        biscuit: this.cakeBiscuit,
        cream: this.cakeCream,
        kat: this.cakeLayers,
        birthday: this.isBirthdayCake,
        age: this.birthdayCandles,
        pickupDateTime: this.pickupDate,
        totalPrice: this.totalPrice,
        userId: this.userId
      };

      try {
        const response = await fetch('http://localhost:3000/custom-cake/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cakeData)
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Cake created successfully:', result);
          this.closeModal();
        } else {
          console.error('Error creating cake:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating cake:', error);
      }
        alert('Odabir potvrđen!');
        this.closeModal();
      },
      handleFileChange(event) {
      this.imageFile = event.target.files[0];
    },
        submitImageForm() {
          let imageComment = this.imageComment;
    let commenterName = 'Ivan';
    let imagePickupDate = this.imagePickupDate;
    let imageFile = this.imageFile;

    console.log('Image File:', imageFile);
    console.log('Image Comment:', imageComment);
    console.log('Pickup Date:', imagePickupDate);

    const formData = new FormData();
    if (imageFile) {
        formData.append('image', imageFile); 
    } else {
        console.error('No file selected');
    }
    console.log("before form data user id", this.userId)
    formData.append('userId', this.userId);
    formData.append('comment', imageComment);
    formData.append('pickupDate', imagePickupDate);

    for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

        console.log(formData);
        fetch('http://localhost:3000/upload/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
            alert('Slika uspješno uploadana!');
            } else {
            throw new Error('Došlo je do greške pri uploadu slike.');
            }
        })
        .catch(error => alert(error.message))
        .finally(() => {
            this.closeImageModal();
            this.resetImageForm();
        });
        },
        resetImageForm() {
        this.imageFile = null;
        this.imageComment = '';
        this.imagePickupDate = '';
        },
        closeImageModal() {
        this.$refs.imageFormModal.style.display = 'none';
        },
      resetImageForm() {
        this.imageFile = null;
        this.imageComment = '';
        this.imagePickupDate = '';
      },
      updateCakeShape() {
        console.log("Cake shape updated to:", this.cakeShape);
        this.calculatePrice();
      },
      updateCakeSize() {
        console.log("Cake size updated to:", this.cakeSize);
        this.calculatePrice();
      },
      updateCakeColor() {
        console.log("Cake color updated to:", this.cakeColor);
      },
      updateCakeCream() {
      console.log("Cake cream updated to:", this.cakeCream);
      this.calculatePrice();
      },
      updateCakeBiscuit() {
      console.log("Cake cream updated to:", this.cakeBiscuit);
      this.calculatePrice();
      },
      updateCakeLayers() {
      console.log("Cake cream updated to:", this.cakeLayers);
      this.calculatePrice();
      },
      updateBirthdayCandles() {
      console.log("Cake cream updated to:", this.birthdayCandles);
      this.calculatePrice();
      },
    
      toggleBirthdayOptions() {
        console.log("Birthday options toggled. Is birthday cake:", this.isBirthdayCake);
        if (!this.isBirthdayCake) {
          this.birthdayCandles = 0;
        }
      },
      addCandles() {
        console.log(this.birthdayCandles, "candles added.");
      },
      calculatePrice() {
      let basePrice = 20; 
      
      if (this.cakeShape === "Pravokutna") {
        basePrice += 5;
      }
      
      if (this.cakeSize === "Srednja") {
        basePrice += 10;
      } else if (this.cakeSize === "Velika") {
        basePrice += 20;
      }
      
      if (this.cakeBiscuit === "Badem") {
        basePrice += 5;
      } else if (this.cakeBiscuit === "Orah") {
        basePrice += 7;
      }
      else if (this.cakeBiscuit === "Jaja") {
        basePrice += 4;
      }
      
      if (this.cakeCream === "nutella") {
        basePrice += 4;
      } else if (this.cakeCream === "Pehar") {
        basePrice += 3;
      } else if (this.cakeCream === "Jogurtica") {
        basePrice += 2;
      }
      else if (this.cakeCream === "Šlag") {
        basePrice += 1;
      }
      
      if (this.cakeLayers === "DvaKata") {
        basePrice += 10;
      } else if (this.cakeLayers === "TriKata") {
        basePrice += 20;
      }
      
      if (this.isBirthdayCake && this.birthdayCandles > 0) {
        basePrice += this.birthdayCandles * 0.5; 
      }
      
      this.totalPrice = basePrice;
      console.log("Total price calculated:", this.totalPrice);
    }
  },
  
    mounted() {
    this.checkLoginStatus();
    this.fetchCurrentUserDetails();
  }
};
</script>

  <style>
  </style>