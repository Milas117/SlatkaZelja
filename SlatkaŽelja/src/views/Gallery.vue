<template>
  <div>
    <div class="lightbox-background" @click="closeLightbox" v-if="lightboxImage">
      <div class="lightbox-content">
        <img :src="lightboxImage" id="lightbox-image">
      </div>
    </div>

    <div class="container">
      <h1 class="gallery-title">Narudžbe</h1>
      <table class="gallery-table">
        <thead>
          <tr>
            <th>Naručitelj</th>
            <th>Detalji narudžbe</th>
            <th>Tip narudžbe</th>
            <th>Status</th>
            <th>Zakazani datum</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in sortedOrders" :key="order._id">
            <td>{{ order.orderedByUsername || order }}</td>
            <td @click="showDetails(order)">Prikaži detalje</td>
            <td>{{ order.tip }}</td>
            <td :class="getStatusClass(order.status)">{{ order.status || 'Na čekanju' }}</td>
            <td>{{ order.datumPreuzimanja || 'Na čekanju' }}</td>
            <td><button @click.stop="deleteOrder(order._id)">Obriši</button></td>
          </tr>
        </tbody>
      </table>

      
    </div>

    <div v-if="detailsModalVisible" ref="detailsModal" id="detailsModal">
  <h2>Detalji narudžbe</h2>
  <div v-html="orderDetails"></div>
  <div class="modal-footer">
    <select v-model="selectedOrderStatus" id="orderStatus">
      <option value="Prihvaćeno">Prihvati narudžbu</option>
      <option value="Odbijeno">Odbij narudžbu</option>
    </select>
    <button type="button" class="btn btn-success" @click="updateOrderStatus">Pošalji</button>
    <button @click="closeModal">Zatvori</button>
  </div>
</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      detailsModalVisible: false,
      orderDetails: '',
      selectedOrderStatus: 'Prihvaćeno',
      lightboxImage: '',
      orderId: ''
    };
  },
  computed: {
    sortedOrders() {
      return this.orders.slice().sort((a, b) => {
        const dateA = new Date(a.datumPreuzimanja);
        const dateB = new Date(b.datumPreuzimanja);
        return dateA - dateB;
      });
    }
  },
  methods: {
    fetchAndDisplayOrders() {
      fetch('http://localhost:3000/gallery', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          this.orders = data;
          console.log("evo orderi: ", data);
        })
        .catch(err => console.error('Error fetching gallery data:', err));
    },
    deleteOrder(id) {
      fetch(`http://localhost:3000/mark-order-as-deleted/${id}`, { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to mark the order as deleted');
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
          this.fetchAndDisplayOrders();
        })
        .catch(err => {
          console.error('Error marking order as deleted:', err);
          alert('Error marking order as deleted: ' + err.message);
        });
    },
    showDetails(item) {
      this.orderId = item._id;
      this.currentOrderId = item._id;
      this.detailsModalVisible = true;
      this.orderDetails = `<p>Tip: ${item.tip}</p>`;
      this.detailsModalVisible = true;
      this.$nextTick(() => {
        this.$refs.detailsModal.style.display = 'block';
        this.orderDetails = `<p>Tip: ${item.tip}</p>`;
        if (item.tip === 'Torte') {
          const detaljiParts = item.detalji.split(', ');
          detaljiParts.forEach(part => {
            if (!part.startsWith("Boja:")) {
              this.orderDetails += `<p>${part}</p>`;
            }
          });
          const colorMatch = item.detalji.match(/Boja: (#\w+)/);
          const color = colorMatch ? colorMatch[1] : '#FFFFFF';
          this.orderDetails += `<p>Boja: <span style="display: inline-block; width: 30px; height: 30px; background-color: ${color}; border: 1px solid #000;"></span> ${color}</p>`;

          const priceMatch = item.detalji.match(/Cijena: €(\d+\.\d+)/);
          const price = priceMatch ? priceMatch[1] : 'Nije dostupno';
          this.orderDetails += `<p>Ukupna cijena: ${price} €</p>`;
        } else if (item.tip === 'Kolači') {
          this.orderDetails += `<p>Broj tacni: ${item.brojTacni}</p>`;
          item.kolači.forEach(kolac => {
            const parts = kolac.match(/Vrsta kolača: (.+), Broj: (\d+), Cijena po komadu: €(\d+\.\d+)/);
            if (parts) {
              this.orderDetails += `<p>Vrsta kolača: ${parts[1]}, Broj: ${parts[2]}, Cijena po komadu: €${parts[3]}</p>`;
            }
          });
          this.orderDetails += `<p>Ukupna cijena: ${item.ukupnaCijena}</p>`;
        } else if (item.tip === 'Slike') {
          this.orderDetails += `<a href="${item.imagePath}"><img src="${item.imagePath}" style="width: 500px; cursor: pointer;" @click="showImageInLightbox('${item.imagePath}')"></a>`;
          this.orderDetails += `<p>Komentari: "${item.comments}"</p>`;
        }
        document.getElementById('updateStatusButton').onclick = () => this.updateOrderStatus(item._id);
      });
    },
    async updateOrderStatus(orderId) {
      orderId = this.orderId;

      const status = this.selectedOrderStatus;

      console.log(JSON.stringify({ orderId, status }));
      fetch('http://localhost:3000/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, status })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update order status');
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
          this.closeModal();
          this.fetchAndDisplayOrders();
        })
        .catch(err => {
          console.error('Error updating order status:', err);
          alert('Error updating order status: ' + err.message);
        });
    },
    closeModal() {
      this.detailsModalVisible = false;
    },
    logout() {
      localStorage.removeItem('korisnik');
      this.isLoggedIn = false;
      this.korisnik = '';
      console.log('User logged out.');
      window.location.replace('/');
    },
    showImageInLightbox(imagePath) {
      this.lightboxImage = imagePath;
      document.querySelector('.lightbox-background').style.display = 'flex';
    },
    closeLightbox() {
      document.querySelector('.lightbox-background').style.display = 'none';
    },
    getStatusClass(status) {
      console.log(status);
      if (status == 'Prihvaćeno') return 'accepted';
      if (status == 'Odbijeno') return 'rejected';
      if (status == 'na čekanju') return 'pending';
      return '';
    }
  },
  mounted() {
    this.fetchAndDisplayOrders();
  }
};
</script>

<style>
.accepted {
  background-color: green;
}

.rejected {
  background-color: red;
}

.pending {
  background-color: orange;
}
</style>
