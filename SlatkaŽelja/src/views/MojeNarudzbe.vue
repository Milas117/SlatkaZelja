<template>
  <div>
    <div class="container">
      <h1 class="text-center mb-4">Moje narudžbe</h1>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Broj narudžbe</th>
              <th>Detalji</th>
              <th>Datum kreiranja narudžbe</th>
              <th>Datum preuzimanja narudžbe</th>
              <th>Status narudžbe</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orders" :key="order.orderNumber">
              <td>{{ index + 1 }}</td>
              <td><button class="btn btn-info" @click="showOrderDetails(order)">Prikaži detalje</button></td>
              <td>{{ order.datumKreiranja || 'Nema datuma' }}</td>
              <td>{{ order.datumPreuzimanja || 'Nema datuma' }}</td>
              <td>{{ order.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="detailsModal" tabindex="-1" role="dialog" aria-labelledby="detailsModalLabel" aria-hidden="true" ref="detailsModal">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="closeDetailsModal">&times;</button>
            <h4 class="modal-title">Detalji narudžbe</h4>
          </div>
          <div class="modal-body" id="orderDetails">
            <p v-html="orderDetailsContent" style="display: inline-block;"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" @click="closeDetailsModal">Zatvori</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import $ from 'jquery'; 
export default {
  data() {
    return {
      userDetails: {
        username: '',
        firstName: '',
        lastName: ''
      },
      oldPassword: '',
      newPassword: '',
      orders: [],
      orderDetailsContent: '',
      showModal: false,
      isLoggedIn: false,
      korisnik: '',
      storedUser: '',
      currentUserId: '',
    };
  },
  methods: {
    
    async fetchOrders() {
      try {
        const response = await fetch('http://localhost:3000/my-orders', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log(data, this.userId);
        console.log("response",data)
        const userOrders = data.filter(order => order.userId._id == this.userId);
        if (userOrders.length > 0) {
          this.orders = userOrders;
        } else {
          console.log("No orders found for user:", this.userId);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    },
    showOrderDetails(order) {
      this.orderDetailsContent = this.prepareOrderDetails(order);
      this.$refs.detailsModal.style.display = 'block';
    },
    prepareOrderDetails(order) {
      let details = '';
      if (order.tip === 'Torte') {
        const detaljiParts = order.detalji.split(', ');
        details += `<p>Tip: ${order.tip}</p>`;
        detaljiParts.forEach(part => {
          if (!part.startsWith("Boja:")) {
            details += `<p>${part}</p>`;
          }
        });

        const colorMatch = order.detalji.match(/Boja: (#\w+)/);
        const color = colorMatch ? colorMatch[1] : '#FFFFFF';
        details += `<p>Boja: <span style="display: inline-block; width: 30px; height: 30px; background-color: ${color}; border: 1px solid #000;"></span> ${color}</p>`;

        const priceMatch = order.detalji.match(/Cijena: €(\d+\.\d+)/);
        const price = priceMatch ? priceMatch[1] : 'Nije dostupno';
        details += `<p>Ukupna cijena: €${price}</p>`;
      } else if (order.tip === 'Kolači') {
        details += `<p>Tip: ${order.tip}</p>`;
        details += `<p>Broj tacni: ${order.brojTacni}</p>`;
        order.kolači.forEach(kolac => {
          const parts = kolac.match(/Vrsta kolača: (.+), Broj: (\d+), Cijena po komadu: €(\d+\.\d+)/);
          if (parts) {
            details += `<p>Vrsta kolača: ${parts[1]}, Broj: ${parts[2]}, Cijena po komadu: €${parts[3]}</p>`;
          }
        });
        details += `<p>Ukupna cijena: ${order.ukupnaCijena}</p>`;
      } else if (order.tip === 'Slike') {
        details += `<p>Tip: ${order.tip}</p>`;
        details += `<img src="${order.imagePath}" style="max-width: 100%; max-height: 400px; cursor: pointer;" @click="openImage('${order.imagePath}')">`;
        details += `<p>Komentari: ${order.comments}</p>`;
      }

      return details;
    },
    closeDetailsModal() {
      this.$refs.detailsModal.style.display = 'none';
    },
    closeModal() {
      this.$refs.detailsModal.style.display = 'none';
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
                    this.currentUserId = data.user_id;
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
    async updateUserDetails() {
      const userData = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      };

      try {
        const response = await fetch('/update-user-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error('Failed to update user details');
        }

        alert('Lozinka je ažurirana!');
        $(this.$refs.userDetailsModal).modal('hide');
      } catch (error) {
        console.error('Error updating user details:', error);
        alert('Došlo je do greške pri promjeni lozinke.');
      }
    }
  },
  mounted() {
    this.fetchOrders();
    this.fetchCurrentUserDetails(); 
  }
};
</script>

<style>
@import '.././assets/MyOrders.css';

.container {
  max-width: 100%;
  padding: 0 15px;
  margin: auto;
}

.modal-content {
  max-width: 600px; 
  margin: 10% auto;
  margin-top: 300px !important;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}

@media (max-width: 767px) {
  .modal-content {
    max-width: 90%;
  }
}
</style>