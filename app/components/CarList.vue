<template>
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
</template>
 
<script setup>
import { ref , computed , onMounted } from 'vue';

const props = defineProps({
  parkedCars: Array,
});

const emit = defineEmits(['exit', 'cancel']);
const tick = ref(0);
const searchValue = ref("");

onMounted(() => {
  setInterval(() => tick.value++, 1000)
})
const visibleCars = computed(() => {
  tick.value; 
  return props.parkedCars.filter(car =>
    car.plate.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});

function removeCar(plate) {
  emit('exit', plate);
}

function cancelCar(plate) {
  emit('cancel', plate);
}
</script>