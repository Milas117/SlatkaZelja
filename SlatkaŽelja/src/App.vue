<template>
  <div>
    <div class="header">
      <router-link to="/">
        <img class="image" src="./assets/images/slatkaželja.jpg" alt="Slatka Želja" width="200" height="125" />
      </router-link>
      <img class="image" src="./assets/images/byzeljka.png" alt="By Željka" width="80" height="25" />
    </div>
    <nav class="navbar navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link to="/" class="navbar-brand">Slatka Želja</router-link>
        </div>
        <ul class="nav navbar-nav">
          <li><router-link to="/torte">Torte</router-link></li>
          <li><router-link to="/kolaci">Kolači</router-link></li>
        </ul>
        <ul class="nav navbar-nav navbar-right" id="navLinks">
          <li v-if="isLoggedIn && isUser" id="myOrdersLink">
  <router-link to="/moje_narudzbe"><span class="glyphicon glyphicon-list-alt"></span> Moje narudžbe</router-link>
</li>
          <li v-if="isAdmin" id="myOrdersLink"><router-link to="/galerija"><span class="glyphicon glyphicon-list-alt"></span> Popis svih narudžbi</router-link></li>
          <li v-if="isLoggedIn" id="korisnikPlaceholder">
            <a href="#" @click.prevent="showModal"><span class="glyphicon glyphicon-user"></span> <span id="usernamePlaceholder">{{ korisnik }}</span></a>
          </li>
          <li v-if="isLoggedIn" id="logoutPlaceholder"><a href="#" @click="logout"><span class="glyphicon glyphicon-log-out"></span> Odjava</a></li>
          <li v-if="!isLoggedIn"><router-link to="/registracija"><span class="glyphicon glyphicon-user"></span> Registracija </router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/prijava"><span class="glyphicon glyphicon-log-in"></span> Prijava </router-link></li>
        </ul>
      </div>
    </nav>
    <div v-if="isModalVisible" class="modal fade show" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="userDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userDetailsModalLabel">Korisnički Podaci</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" id="changePassModal" ref="changePassModal">
            <form id="userDetailsForm">
              <div class="form-group">
                <label for="username">Korisničko Ime</label>
                <input type="text" class="form-control" id="username" :value="korisnik" disabled>
              </div>
              <div class="form-group">
                <label for="firstName">Ime</label>
                <input type="text" class="form-control" id="firstName" v-model="userDetails.user.ime" readonly>
              </div>
              <div class="form-group">
                <label for="lastName">Prezime</label>
                <input type="text" class="form-control" id="lastName" v-model="userDetails.user.prezime" readonly>
              </div>
              <div class="form-group">
                <label for="oldPassword">Stara Lozinka</label>
                <input type="password" class="form-control" id="oldPassword" v-model="oldPassword">
              </div>
              <div class="form-group">
                <label for="newPassword">Nova Lozinka</label>
                <input type="password" class="form-control" id="newPassword" v-model="newPassword">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Zatvori</button>
            <button type="button" class="btn btn-primary" @click="updateUserDetails">Spremi Promjene</button>
          </div>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      isUser:false,
      korisnik: '',
      userDetails: {
        username: '',
        firstName: '',
        lastName: ''
      },
      oldPassword: '',
      newPassword: '',
      isModalVisible: false,
      storedUser: '',
      userId: ''
    };
  },
  created() {
    const storedUser = localStorage.getItem('korisnik');
    if (storedUser) {
      this.isLoggedIn = true;
      if (storedUser == 'admin') {
        this.isAdmin = true;
      }else{
        this.isUser=true;
      }
      this.korisnik = storedUser;
      console.log(`User ${storedUser} is logged in.`);
    } else {
      console.log('No user is logged in.');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('korisnik');
      this.isLoggedIn = false;
      this.korisnik = '';
      console.log('User logged out.');
      this.$router.replace('/');
    },
    showModal() {
      this.isModalVisible = true;
      console.log("Modal is shown");
    },
    closeModal() {
      this.isModalVisible = false;
      console.log("Modal is hidden");
    },
    async updateUserDetails() {
      try {
        const response = await fetch('http://localhost:3000/update-user-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: this.userId,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Password updated successfully:', data.message);
        } else {
          console.log('Failed to update password:', data.message);
        }
      } catch (error) {
        console.error('Error updating password:', error);
      }
      this.closeModal();
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
      }
  },
  mounted()
  {
    this.fetchCurrentUserDetails();
  }
};
</script>

<style scoped>
.navbar-inverse .navbar-nav>li>a:focus,
.navbar-inverse .navbar-nav>li>a:hover {
  color: #e67e22;
  background-color: transparent;
}

.navbar-inverse .navbar-brand:focus,
.navbar-inverse .navbar-brand:hover {
  color: #e67e22;
  background-color: transparent;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: #e67e22;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    font-size: 1rem;
  }
}

.modal {
  display: none;
}
.modal.show {
  display: block;
}
</style>
