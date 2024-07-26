<template>
  <div>
    <div style="padding: 20px;">
      <input type="checkbox" id="multi-select-mode" v-model="multiSelectMode">
      <label for="multi-select-mode" style="font-family: 'Caveat', cursive; color: rgb(0, 0, 0); font-size: 105%; margin-bottom: 5px;">Višestruki odabir</label>
    </div>

    <div id="popup" class="popup" v-show="popupVisible">
      <div id="popupheader"></div>
      <span class="close" @click="closePopup">&times;</span>
      <form id="cakeForm" @submit.prevent="submitCakeForm">
        <input type="hidden" id="current-slot" ref="currentSlot">
        <label for="cakeType">Odaberite kolač:</label>
        <select id="cakeType" v-model="selectedCakeType" @change="updateCaloriesInfo">
          <option v-for="(details, type) in cakeDetails" :key="type" :value="type">{{ type }}</option>
        </select>
        <div id="calories-info">Broj kalorija: {{ selectedCakeCalories }}</div>
        <button type="submit">Dodaj na tacnu</button>
      </form>
    </div>

    <div id="trayModal" class="modal" v-show="trayModalVisible">
      <div class="modal-content">
        <span class="close" @click="closeTrayModal">&times;</span>
        <h2>Unesite broj tacni koje želite naručiti</h2>
        <input type="number" id="tray-count" v-model.number="trayCount" min="1">
        <button @click="confirmOrder">Potvrdi narudžbu</button>
        <button type="button" class="btn btn-secondary" @click="closeTrayModal">Odustani</button>
        <label for="pickupDate">Datum preuzimanja:</label>
        <input type="date" id="pickupDate" name="pickupDate" v-model="pickupDate" required>
      </div>
    </div>

    <div ref="tray" class="tray"></div>

    <div id="order-summary">
      <div id="order-controls" style="text-align: center; margin-top: 20px;">
        <button id="toggle-order-details" @click="toggleOrderDetails" v-text="showOrderDetails ? 'Sakrij detalje narudžbe' : 'Prikaži detalje narudžbe'"></button>
        <br>
        <button @click="resetTray">Obriši kolače</button>
        <br>
        <div id="order-details" v-show="showOrderDetails" style="margin-top: 10px;">
          <h3>Ukupna cijena: <span id="total-price">{{ totalPrice }} EUR</span></h3>
          <h3>Ukupan broj kalorija: <span id="total-calories-info">{{ totalCalories }}</span></h3>
          <h2>Unesite broj tacni koje želite naručiti</h2>
          <input type="number" id="tray-count" v-model.number="trayCount" min="1">
          <label for="pickupDate"><h3>Datum preuzimanja:</h3></label>
          <input type="date" id="pickupDate" v-model="pickupDate" required>
          <br>
          <br>
          <button id="order-button" @click.prevent="confirmOrder()">Naruči kolače</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userDetails: {
        username: '',
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
      },
      selectedCakeType: 'mađarica',
      trayCount: 1,
      pickupDate: '',
      showOrderDetails: false,
      multiSelectMode: false,
      popupVisible: false,
      trayModalVisible: false,
      totalPrice: 0,
      totalCalories: 0,
      userId: '', 
      selectedCakeCalories: 0,
      tray: [], 
      selectedSlotId: null,
      cakeDetails: {
        'mađarica': { price: 0.50, calories: 250, image: '/src/assets/images/Mađarica.png' },
        'ruskakapa': { price: 0.60, calories: 300, image: '/src/assets/images/Ruskekape.png' },
        'bijelapita': { price: 0.50, calories: 180, image: '/src/assets/images/Bijelapita.png' },
        'lidija': { price: 0.50, calories: 220, image: '/src/assets/images/Lidija.png' },
        'monte': { price: 0.30, calories: 210, image: '/src/assets/images/Monte.png' },
        'breskvice': { price: 1.00, calories: 260, image: '/src/assets/images/Breskvica.png' },
        'čupavci': { price: 0.50, calories: 190, image: '/src/assets/images/Čupavci.png' }
      }
    };
  },
  methods: {
    closeUserDetailsModal() {
      ('#userDetailsModal').modal('hide');
    },
    toggleOrderDetails() {
      this.showOrderDetails = !this.showOrderDetails;
    },
    updateUserDetails() {
      const userDetails = {
        oldPassword: this.userDetails.oldPassword,
        newPassword: this.userDetails.newPassword
      };
      fetch('http://localhost:3000/update-user-password', {
        method: 'POST',
        body: JSON.stringify(userDetails),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert('Lozinka je ažurirana!');
        this.closeUserDetailsModal();
      })
      .catch(error => {
        alert('Došlo je do greške pri promjeni lozinke.');
        console.error('Error:', error);
      });
    },
    fetchCurrentUserDetails() {
      const storedUser = localStorage.getItem('korisnik');
      if (storedUser) {
        fetch(`http://localhost:3000/get-user-details/${storedUser}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            console.log('User Details:', data);
            this.userId = data.user._id;
            this.userDetails = {
              username: data.user.username,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              oldPassword: '',
              newPassword: ''
            };
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
      } else {
        console.warn('No user found in local storage');
      }
    },
    isSlotFilled(slot) {
      return !!slot.dataset.cake;
    },
    closePopup() {
      this.popupVisible = false;
    },
    submitCakeForm() {
      const selectedSlots = document.querySelectorAll('.slot.selected');
      selectedSlots.forEach(slot => {
        const cakeType = this.selectedCakeType;
        slot.innerHTML = `<img src="${this.cakeDetails[cakeType].image}" alt="${cakeType}" />`;
        slot.dataset.cake = cakeType;
        slot.classList.remove('selected');
        this.tray.push({ cakeType: cakeType });
      });
      this.updateTotalPriceAndCalories();
      this.popupVisible = false;
    },
    updateCaloriesInfo() {
      const cakeType = this.selectedCakeType;
      const caloriesInfo = document.getElementById('calories-info');
      if (caloriesInfo) {
        caloriesInfo.textContent = `Broj kalorija: ${this.cakeDetails[cakeType].calories}`;
      }
    },
    handleSlotClick(event) {
      const slot = event.currentTarget;
      this.selectedSlotId = slot.id;
      this.popupVisible = true;
      this.selectedCakeType = slot.dataset.cake || this.selectedCakeType;
    },
    resetTray() {
      const slots = document.querySelectorAll('.slot');
      slots.forEach(slot => {
        slot.innerHTML = ''; 
        delete slot.dataset.cake; 
      });
      this.tray = []; 
      this.updateTotalPriceAndCalories(); 
    },
    updateTotalPriceAndCalories() {
      let totalPrice = 0;
      let totalCalories = 0;
      this.tray.forEach(cake => {
        const cakeType = cake.cakeType;
        totalPrice += this.cakeDetails[cakeType].price;
        totalCalories += this.cakeDetails[cakeType].calories;
      });
      this.totalPrice = totalPrice.toFixed(2);
      this.totalCalories = totalCalories;
    },
    showTrayModal() {
      this.trayModalVisible = true;
    },
    closeTrayModal() {
      this.trayModalVisible = false;
    },
    confirmOrder() {
      if (!this.pickupDate) {
        alert('Potrebno je unijeti datum narudžbe.');
        return;
      }

      const trayData = {
        trayCount: this.trayCount,
        cakes: [],
        totalPrice: 0,
        pickupDate: this.pickupDate,
        userId: this.userId 
      };

      this.tray.forEach(cake => {
        const cakeType = cake.cakeType;
        const existingCake = trayData.cakes.find(c => c.cakeType === cakeType);
        if (existingCake) {
          existingCake.count++;
        } else {
          trayData.cakes.push({
            cakeType: cakeType,
            count: 1,
            pricePerPiece: parseFloat(this.cakeDetails[cakeType].price)
          });
        }
      });

      trayData.cakes.forEach(cake => {
        trayData.totalPrice += cake.count * cake.pricePerPiece;
      });

      fetch('http://localhost:3000/save-tray', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userId}` 
        },
        body: JSON.stringify(trayData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Tray saved:', data);
        alert(`Hvala na narudžbi ${this.trayCount} tacni!`);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Došlo je do greške: ' + error.message);
      });
    },
    setupDateMin() {
      const today = new Date();
      today.setDate(today.getDate() + 2);
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const twoDaysLater = `${yyyy}-${mm}-${dd}`;
      this.pickupDate = twoDaysLater;
    },
    setupTraySlots() {
      const tray = this.$refs.tray;
      if (!tray) {
        console.error('Element with ref "tray" not found.');
        return;
      }

      for (let i = 0; i < 24; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `slot-${i + 1}`;
        tray.appendChild(slot);

        slot.addEventListener('click', () => {
          if (this.multiSelectMode) {
            slot.classList.toggle('selected');
          } else {
            document.querySelectorAll('.slot.selected').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
          }
          this.popupVisible = true;
          this.$refs.currentSlot.value = slot.id;
          this.updateCaloriesInfo();
        });
      }
    },
    makeDraggable() {
      const popup = document.getElementById("popup");
      const popupHeader = document.getElementById("popupheader");
      let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

      popupHeader.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        offsetX = startX - e.clientX;
        offsetY = startY - e.clientY;
        startX = e.clientX;
        startY = e.clientY;
        popup.style.top = (popup.offsetTop - offsetY) + "px";
        popup.style.left = (popup.offsetLeft - offsetX) + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  },
  computed: {
    selectedSlot() {
      return document.querySelector('.slot.selected');
    },
  },
  mounted() {
    this.setupDateMin();
    this.setupTraySlots();
    this.updateTotalPriceAndCalories();
    this.fetchCurrentUserDetails();
    this.makeDraggable();
  }
};
</script>

<style scoped>
.tray {
  display: grid;
  flex-wrap: wrap;
  gap: 10px;
}

.slot {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.slot img {
  max-width: 100%;
  max-height: 100%;
}

.slot.selected {
  border-color: blue;
  background-color: lightblue;
}

#popup {
  position: absolute;
  z-index: 1000;
  background-color: white;
  border: 1px solid black;
  padding: 20px;
  width: 350px;
}

#popupheader {
  cursor: move;
  padding: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #ffffff;
}
</style>
