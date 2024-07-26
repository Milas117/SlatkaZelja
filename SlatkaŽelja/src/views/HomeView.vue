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
                      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeUserDetailsModal">Zatvori</button>
                      <button type="button" class="btn btn-primary" @click="updateUserDetails">Spremi Promjene</button>
                  </div>
              </div>
          </div>
      </div>
  
      <div id="auto-slideshow" class="slideshow-container">
          <div class="mySlidesAuto fade" v-for="(slide, index) in slides" :key="index" v-show="currentAutoSlide === index">
                  <img :src="slide" style="width:100%">
          </div>
  
          <a class="prev" @click="changeSlides(-1)">&#10094;</a>
          <a class="next" @click="changeSlides(1)">&#10095;</a>
      </div>
      <section class="page-section" id="services">
          <div class="container">
              <div class="row text-center">
                  <div class="col-md-4">
                      <div class="service-item">
                          <router-link to="/torte">
                              <img src="../assets/images/Icona5.jpg" class="img-fluid" alt="Torta 1"> </router-link>
                          <h4 class="my-3">Personalizirane Torte</h4>
                          <p class="text-muted">Naruči svoju personaliziranu tortu i iznenadi svoje najmilije!</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="service-item">
                        <router-link to="/torte">
                              <img src="../assets/images/Icona1.jpg" class="img-fluid" alt="Torta 2"></router-link>
                          <h4 class="my-3">Pošalji fotku torte</h4>
                          <p class="text-muted">Kakvu god tortu zaželite mi pravimo!</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="service-item">
                        <router-link to="/kolaci">
                              <img src="../assets/images/Icona4.jpg" class="img-fluid" alt="Torta 2"> </router-link>
                          <h4 class="my-3">Naručivanje Kolača</h4>
                          <p class="text-muted">Imamo širok izbor kolača za sve prigode. Naruči svoj omiljeni kolač danas!</p>
                      </div>
                  </div>
  
              </div>
          </div>
      </section>
  
      <div id="slideshow" class="gallery-container">
          <h1>Galerija naših najljepših torti</h1>
          <div class="gallery-grid">
              <img src="../assets/images/1.jpg" alt="Opis slike 1" @click="openModal(1);">
              <img src="../assets/images/2.jpg" alt="Opis slike 2" @click="openModal(2);">
              <img src="../assets/images/3.jpg" alt="Opis slike 3" @click="openModal(3);">
              <img src="../assets/images/4.jpg" alt="Opis slike 4" @click="openModal(4);">
              <img src="../assets/images/5.jpg" alt="Opis slike 5" @click="openModal(5);">
              <img src="../assets/images/6.jpg" alt="Opis slike 6" @click="openModal(6);">
          </div>
          <div id="myModal" class="modal" v-show="showModal">
              <span class="close cursor" @click="closeModal">&times;</span>
              <div class="modal-content">
                  <div v-for="(slide, index) in modalSlides" :key="index" class="mySlides" v-show="currentSlide === index">
                    <img :src="slide" style="width:100%">
                  </div>
  
                  <a class="prev" @click="plusSlides(-1)">&#10094;</a>
                  <a class="next" @click="plusSlides(1)">&#10095;</a>
              </div>
          </div>
      </div>
  
      <div class="social-icons">
          <a href="https://www.facebook.com/p/Slatka-%C5%BDelja-100063583868326/" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/slatka_zelja/" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      isLoggedIn: false,
      korisnik: '',
      userDetails: {
        username: '',
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: ''
      },
      slides: [
        "/src/assets/images/Slika1.jpg",
        "/src/assets/images/Slika2.jpg",
        "/src/assets/images/Slika3.jpg",
        "/src/assets/images/Slika4.jpg",
        "/src/assets/images/Slika5.jpg"
      ],
      currentAutoSlide: 0,
      showModal: false,
      modalSlides: [
        "src/assets/images/1.jpg",
        "src/assets/images/2.jpg",
        "src/assets/images/3.jpg",
        "src/assets/images/4.jpg",
        "src/assets/images/5.jpg",
        "src/assets/images/6.jpg"
      ],
      currentSlide: 0
    };
  },
  mounted() {
    this.checkSessionStatus();
    this.startAutoSlides();
  },
  methods: {
    checkSessionStatus() {
      fetch('http://localhost:3000/session-status')
        .then(response => response.json())
        .then(data => {
          this.isLoggedIn = data.loggedIn;
          if (data.loggedIn) {
            this.korisnik = data.korisnik;
          }
        })
        .catch(error => {
          console.error('Error fetching session status:', error);
        });
    },
    fetchUserDetails() {
      fetch('http://localhost:3000/get-user-details')
        .then(response => response.json())
        .then(data => {
          this.userDetails.username = data.korisnickoime;
          this.userDetails.firstName = data.ime;
          this.userDetails.lastName = data.prezime;
          this.showModal = true;
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          alert('Došlo je do greške pri dohvaćanju korisničkih podataka.');
        });
    },
    updateUserDetails() {
      const userDetails = {
        oldPassword: this.userDetails.oldPassword,
        newPassword: this.userDetails.newPassword
      };

      fetch('/update-user-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
      })
        .then(response => response.json())
        .then(data => {
          alert('Lozinka je ažurirana!');
          this.closeUserDetailsModal();
        })
        .catch(error => {
          console.error('Error updating user password:', error);
          alert('Došlo je do greške pri promjeni lozinke.');
        });
    },
    openModal(index) {
      document.getElementById('myModal').style.display = "block";
      this.currentSlide = index - 1;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    plusSlides(n) {
      this.currentSlide += n;
      if (this.currentSlide >= this.modalSlides.length) {
        this.currentSlide = 0;
      } else if (this.currentSlide < 0) {
        this.currentSlide = this.modalSlides.length - 1;
      }
    },
    startAutoSlides() {
      setInterval(() => {
        this.currentAutoSlide++;
        if (this.currentAutoSlide >= this.slides.length) {
          this.currentAutoSlide = 0;
        }
      }, 4000);
    },
    changeSlides(n) {
      this.currentAutoSlide += n;
      if (this.currentAutoSlide >= this.slides.length) {
        this.currentAutoSlide = 0;
      } else if (this.currentAutoSlide < 0) {
        this.currentAutoSlide = this.slides.length - 1;
      }
    },
    closeUserDetailsModal() {
      this.showModal = false;
    }
  }
};
</script>
<style>

.mySlides {
  display: block;
}
</style>
