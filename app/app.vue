<template>
  <div class="wrap">
    <header>
      <div>
        <div class="eyebrow">Giriş / Çıkış Kontrol</div>
        <h1>Otopark</h1>
      </div>
    </header>
    <div class="hazard"></div>

    <section class="panel">
      <div class="panel-label">Araç Girişi</div>
      <input
        class="plate-input"
        type="text"
        placeholder="35 AUB 478"
        maxlength="12"
        v-model="plateValue"
      />
      <button class="btn-add" @click="addCar">Araç Ekle</button>
    </section>

    <div class="grid">
        <section class="panel">
          <p class="panel-label">Kapasite</p>
          <p class="capacity-readout">{{ parkedCars.length }} / {{ TOTAL_CAPACITY }}</p>
          <p class="capacity-status">
            <span>Boş yer</span>
            <strong>{{remainingCapacity}}</strong> </p>
        </section>
        <section class="panel">
          <p class="panel-label">Toplam Kasa</p>
          <p class="capacity-readout">{{ totalIncome }} TL</p>
        </section>
    </div>
    <div class="hazard"></div>

    <section class="panel list-panel">
      <div class="panel-label">İçerideki Araçlar</div>
      <input class="search-input" type="text" placeholder="Plaka ara..." v-model="searchValue" />
      <div v-if="visibleCars.length === 0" class="empty-state">
        <template v-if="parkedCars.length === 0">
          <strong>Henüz araç yok.</strong>
          <span>İlk aracı eklemek için yukarıdan plakayı gir.</span>
        </template>
        <template v-else>
          <strong>Araç bulunamadı.</strong>
          <span>Girdiğiniz kriterlere uygun araç bulunamadı.</span>
        </template>
      </div>
      <div v-for="car in visibleCars" :key="car.plate" class="car-row">
        <div class="car-plate">{{ car.plate }}</div>
        <div class="car-meta">
          <span class="car-duration">{{ formatDuration(getDurationSeconds(car.entryTime)) }}</span>
          <span class="car-fee">{{ calculateFee(car.entryTime) }} TL</span>
        </div>
        <button v-if="getDurationMinutes(car.entryTime) < 5" class="cancel-btn" @click="cancelCar(car.plate)">İptal Et</button>
        <button class="exit-row-btn" @click="removeCar(car.plate)">Çıkış Yap</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const parkedCars = ref([]);
parkedCars.value.push({ plate: "", entryTime: ""
, leaveTime: null, price: 0.00});
const plateValue = ref("");
const searchValue = ref("");
const tick = ref(0);
onMounted(() => {
  setInterval(() => tick.value++, 1000)
  const parkedCarsData = localStorage.getItem("parkedCars");
  const totalIncomeData = localStorage.getItem("totalIncome");
  if (parkedCarsData) {
    parkedCars.value = JSON.parse(parkedCarsData);
  }
  if (totalIncomeData) {
    totalIncome.value = JSON.parse(totalIncomeData);
  }
  for(let i = 0; i < parkedCars.value.length; i++) {
    parkedCars.value[i].entryTime = new Date(parkedCars.value[i].entryTime);
  }
})
const visibleCars = computed(() => {
  tick.value; 
  return parkedCars.value.filter(car =>
    car.plate.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});
const plateRegex = /^(\d{2})([A-Z]{1,3})(\d{2,4})$/;
const totalIncome = ref(0);
const TOTAL_CAPACITY = 50;
const remainingCapacity = computed(() => TOTAL_CAPACITY - parkedCars.value.length);

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours} saat ${minutes} dakika ${seconds} saniye`;
}

function getDurationMinutes(entryTime) {
  return Math.floor(getDurationSeconds(entryTime) / 60);
}

function getDurationSeconds(entryTime) {
  const now = new Date();
  const diffMs = now.getTime() - entryTime.getTime();
  return Math.floor(diffMs / 1000);
}

function calculateFee(entryTime) {
  const diffMins = getDurationMinutes(entryTime);
  const hours = Math.ceil(diffMins / 60);
  let totalFee;
  if (diffMins < 15) {
    totalFee = 0;
  }
  else if (hours === 1) {
    totalFee = 200;
  }
  else {
    totalFee = 200 + (hours - 1) * 100;
  }
  return totalFee;
}

function addCar() {
  if(plateValue.value.trim() === "") {
    alert("Lütfen plaka girin.");
    return;
  }
  const normalizedPlate = plateValue.value.replace(/\s+/g, "").toUpperCase();
  if(!plateRegex.test(normalizedPlate)) {
    alert("Geçersiz plaka formatı.");
    return;
  }
  const match = normalizedPlate.match(plateRegex);
  const formattedPlate = `${match[1]} ${match[2]} ${match[3]}`;
  const index = parkedCars.value.findIndex(car => car.plate === formattedPlate);
  if(index !== -1) {
    alert("Araç zaten otoparkta.");
    return;
  }
  parkedCars.value.push({ plate: formattedPlate, entryTime: new Date() });
  plateValue.value = "";
}

function removeCar(plate) {
  const foundCar = parkedCars.value.find(car => car.plate === plate);
  if (!foundCar) {
    alert('Aradığınız araç sistemimizde kayıtlı değil.');
    return;
  } else {
    const fee = calculateFee(foundCar.entryTime);
    alert(`Otopark ücretiniz ${fee} TL. Teşekkürler, tekrar bekleriz.`);
    parkedCars.value = parkedCars.value.filter(car => car.plate !== plate);
    totalIncome.value = totalIncome.value + fee;
  }
} 

function cancelCar(plate) {
  const foundCar = parkedCars.value.find(car => car.plate === plate);
  if (!foundCar) {
    alert('Aradığınız araç sistemimizde kayıtlı değil.');
    return;
  } else {
    parkedCars.value = parkedCars.value.filter(car => car.plate !== plate);
  }
}

watch(parkedCars, () => {
  localStorage.setItem("parkedCars", JSON.stringify(parkedCars.value));
}, { deep: true });

watch(totalIncome, () => {
  localStorage.setItem("totalIncome", JSON.stringify(totalIncome.value));
});
</script> 

<style>
  :root {
    --asphalt: #1C1F22;
    --asphalt-light: #2A2E33;
    --asphalt-border: #3A3F45;
    --lane-yellow: #F4B400;
    --concrete: #EDEAE3;
    --signal-red: #E14B4B;
    --go-green: #3FA66B;
    --steel: #8A9199;

    --font-display: 'Archivo', sans-serif;
    --font-mono: 'Space Mono', monospace;
    --font-body: 'Inter', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--asphalt);
    color: var(--concrete);
    font-family: var(--font-body);
    min-height: 100vh;
    padding: 32px 20px 60px;
  }

  .wrap {
    max-width: 880px;
    margin: 0 auto;
  }

  /* ---- Header ---- */
  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }

  .eyebrow {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.15em;
    color: var(--lane-yellow);
    text-transform: uppercase;
  }

  h1 {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(28px, 5vw, 40px);
    letter-spacing: -0.01em;
  }

  /* ---- Hazard stripe divider: the signature element ---- */
  .hazard {
    height: 10px;
    width: 100%;
    background: repeating-linear-gradient(
      -45deg,
      var(--lane-yellow),
      var(--lane-yellow) 14px,
      var(--asphalt) 14px,
      var(--asphalt) 28px
    );
    border-radius: 3px;
    margin: 18px 0 28px;
  }

  /* ---- Main grid: giriş paneli + kapasite paneli ---- */
  /* ---- Panel sıraları: giriş+çıkış, sonra kapasite+kasa ---- */
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .stack-top {
    margin-top: 20px;
  }

  .capacity-readout.readout-green {
    color: var(--go-green);
  }

  .panel {
    background: var(--asphalt-light);
    border: 1px solid var(--asphalt-border);
    border-radius: 10px;
    padding: 24px;
  }

  .panel-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--steel);
    margin-bottom: 16px;
  }

  /* ---- Giriş paneli ---- */
  .plate-input {
    width: 100%;
    background: var(--asphalt);
    border: 2px solid var(--asphalt-border);
    border-radius: 8px;
    color: var(--concrete);
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 14px 16px;
    margin-bottom: 14px;
    transition: border-color 0.15s ease;
  }

  .plate-input::placeholder {
    color: var(--steel);
    opacity: 0.6;
  }

  .plate-input:focus {
    outline: none;
    border-color: var(--lane-yellow);
  }

  .btn-add {
    width: 100%;
    background: var(--lane-yellow);
    color: var(--asphalt);
    border: none;
    border-radius: 8px;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 14px;
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.1s ease;
  }

  .btn-add:hover { filter: brightness(1.08); }
  .btn-add:active { transform: scale(0.98); }

  .btn-add:focus-visible {
    outline: 3px solid var(--concrete);
    outline-offset: 2px;
  }

  /* ---- Kapasite paneli ---- */
  .capacity-readout {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 40px;
    letter-spacing: 0.05em;
    color: var(--lane-yellow);
    text-align: center;
    background: var(--asphalt);
    border: 1px solid var(--asphalt-border);
    border-radius: 8px;
    padding: 18px 0;
    margin-bottom: 14px;
  }

  .capacity-readout span { color: var(--steel); font-size: 0.6em; }

  .capacity-status {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--steel);
  }

  .capacity-status strong {
    color: var(--go-green);
    font-family: var(--font-mono);
  }

  /* ---- İçerideki araçlar tablosu ---- */
  .list-panel {
    margin-top: 24px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  thead th {
    text-align: left;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--steel);
    padding: 0 0 10px;
    border-bottom: 1px solid var(--asphalt-border);
  }

  tbody td {
    padding: 12px 0;
    border-bottom: 1px solid var(--asphalt-border);
    font-family: var(--font-mono);
  }

  tbody tr:last-child td { border-bottom: none; }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--steel);
    font-size: 14px;
  }

  .empty-state strong {
    display: block;
    color: var(--concrete);
    font-family: var(--font-display);
    font-size: 16px;
    margin-bottom: 6px;
  }

  /* ---- Responsive ---- */
  @media (max-width: 640px) {
    .grid { grid-template-columns: 1fr; }
    .capacity-readout { font-size: 32px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-add { transition: none; }
  }

  .car-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px;
  border-bottom: 1px solid var(--asphalt-border);
  font-family: var(--font-mono);
  font-size: 14px;
}

.car-row:last-child { border-bottom: none; }

.car-row:hover { background: rgba(244, 180, 0, 0.06); }

.car-plate {
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--concrete);
}

.car-time {
  color: var(--steel);
  font-size: 13px;
}

.btn-exit {
  background: var(--signal-red);
  color: var(--concrete);
}

.car-meta {
  display: flex;
  gap: 14px;
  align-items: center;
}

.car-duration {
  color: var(--steel);
  font-size: 13px;
}

.car-fee {
  color: var(--lane-yellow);
  font-weight: 700;
  font-size: 14px;
  min-width: 56px;
  text-align: right;
}

.cancel-btn {
  background: transparent;
  border: 1px solid var(--signal-red);
  color: var(--signal-red);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.cancel-btn:hover {
  background: var(--signal-red);
  color: var(--concrete);
}

.exit-row-btn {
  background: transparent;
  border: 1px solid var(--signal-red);
  color: var(--signal-red);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.exit-row-btn:hover {
  background: var(--signal-red);
  color: var(--concrete);
}

.search-input {
  width: 100%;
  background: var(--asphalt);
  border: 1px solid var(--asphalt-border);
  border-radius: 8px;
  color: var(--concrete);
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.05em;
  padding: 10px 14px;
  margin-bottom: 16px;
}

.search-input::placeholder { color: var(--steel); opacity: 0.6; }
.search-input:focus { outline: none; border-color: var(--lane-yellow); }
</style>