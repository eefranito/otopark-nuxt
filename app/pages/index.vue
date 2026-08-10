<template>
  <div class="wrap">
    <header>
      <div>
        <div class="eyebrow">Giriş / Çıkış Kontrol</div>
        <h1>Otopark</h1>
      </div>
    </header>
    <div class="hazard"></div>

    <CarEntry @add="handleAddCar" />

    <div class="hazard"></div>
    <CarList :parkedCars="parkedCars" @exit="removeCar" @cancel="cancelCar" />
    <CapacityStats
      :carCount="parkedCars.length"
      :totalCapacity="TOTAL_CAPACITY"
      :totalIncome="totalIncome"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const parkedCars = ref([]);
const totalIncome = ref(0);
const TOTAL_CAPACITY = 50;
const parkingHistory = ref([]);

onMounted(() => {
  const parkedCarsData = localStorage.getItem("parkedCars");
  const totalIncomeData = localStorage.getItem("totalIncome");
  const parkingHistoryData = localStorage.getItem("parkingHistory");
  if (parkedCarsData) {
    parkedCars.value = JSON.parse(parkedCarsData);
  }
  if (totalIncomeData) {
    totalIncome.value = JSON.parse(totalIncomeData);
  }
  if(parkingHistoryData) {
    parkingHistory.value = JSON.parse(parkingHistoryData);
  }
  for(let i = 0; i < parkedCars.value.length; i++) {
    parkedCars.value[i].entryTime = new Date(parkedCars.value[i].entryTime);
  }
  for(let i = 0; i < parkingHistory.value.length; i++) {
    parkingHistory.value[i].entryTime = new Date(parkingHistory.value[i].entryTime);
    parkingHistory.value[i].exitTime = new Date(parkingHistory.value[i].exitTime);
  }
})

function removeCar(plate) {
  const foundCar = parkedCars.value.find(car => car.plate === plate);
  if (!foundCar) {
    alert('Aradığınız araç sistemimizde kayıtlı değil.');
    return;
  } else {
    const fee = calculateFee(foundCar.entryTime);
    alert(`Otopark ücretiniz ${fee} TL. Teşekkürler, tekrar bekleriz.`);

    const record = {
      plate: foundCar.plate,
      entryTime: foundCar.entryTime,
      exitTime: new Date(),
      fee: fee,
    };
    parkingHistory.value.push(record);

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

function handleAddCar(plate) {
  const index = parkedCars.value.findIndex(car => car.plate === plate);
  if (index !== -1) {
    alert("Araç zaten otoparkta.");
    return;
  }
  parkedCars.value.push({ plate: plate, entryTime: new Date() });
}

watch(parkedCars, () => {
  localStorage.setItem("parkedCars", JSON.stringify(parkedCars.value));
}, { deep: true });

watch(totalIncome, () => {
  localStorage.setItem("totalIncome", JSON.stringify(totalIncome.value));
});

watch(parkingHistory, () => {
  localStorage.setItem("parkingHistory", JSON.stringify(parkingHistory.value));
}, { deep: true });
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