<template>
  <div class="wrap">
    <header>
      <div>
        <div class="eyebrow">Geçmiş Kayıtlar</div>
        <h1>Takvim</h1>
      </div>
    </header>
    <UCalendar v-model="selectedDate">
      <template #day="{ day }">
        <div class="day-cell">
          <span class="day-number">{{ day.day }}</span>
          <div v-if="getDayStat(day)" class="day-badge">
            <span class="day-count">{{ getDayStat(day).count }}</span>
            <span class="day-income">{{ getDayStat(day).income }}₺</span>
          </div>
        </div>
      </template>
    </UCalendar>
    <section class="panel list-panel stack-top" v-if="selectedDate">
  <div class="panel-label">
    {{ selectedDate.year }}-{{ selectedDate.month }}-{{ selectedDate.day }} Detayı
  </div>
  <div v-if="selectedDayRecords.length === 0" class="empty-state">
    <strong>Bu gün kayıt yok.</strong>
  </div>
  <div v-for="record in selectedDayRecords" :key="record.plate + record.exitTime" class="car-row">
    <div class="car-plate">{{ record.plate }}</div>
    <div class="car-meta">
      <span class="car-duration">{{ record.exitTime.toLocaleTimeString() }}</span>
      <span class="car-fee">{{ record.fee }} TL</span>
    </div>
  </div>
</section>
  </div>
</template>
<style scoped>
.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 2px 0;
}

.day-number {
  font-family: var(--font-mono);
}

.day-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  line-height: 1;
}

.day-count {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--lane-yellow);
  font-weight: 700;
}

.day-income {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--go-green);
}
</style>
<script setup>

const totalIncome = ref(0);
const parkingHistory = ref([]);
const selectedDate = ref(null);

const selectedDayRecords = computed(() => {
  if (!selectedDate.value) return [];
  const key = toDateKey(selectedDate.value.year, selectedDate.value.month, selectedDate.value.day);
  return parkingHistory.value.filter(function (record) {
    const recordKey = getRecordKey(record);
    return recordKey === key;
  });
});

function getDayStat(day) {
  const key = toDateKey(day.year, day.month, day.day);
  return dailyStats.value[key];
}

function toDateKey(year, month, day) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function getRecordKey(record) {
  return toDateKey(record.exitTime.getFullYear(), record.exitTime.getMonth() + 1, record.exitTime.getDate());
}

const dailyStats = computed(() => {
  return parkingHistory.value.reduce((acc, record) => {
    const key = getRecordKey(record);
    if(!(acc[key])) {
      acc[key] = { count: 0, income: 0 }
    }
    acc[key].count += 1;
    acc[key].income += record.fee;
    return acc;
  }, {});
});

onMounted(() => {
  const totalIncomeData = localStorage.getItem("totalIncome");
  const parkingHistoryData = localStorage.getItem("parkingHistory");
  if (totalIncomeData) {
    totalIncome.value = JSON.parse(totalIncomeData);
  }
  if(parkingHistoryData) {
    parkingHistory.value = JSON.parse(parkingHistoryData);
  }
  for(let i = 0; i < parkingHistory.value.length; i++) {
    parkingHistory.value[i].entryTime = new Date(parkingHistory.value[i].entryTime);
    parkingHistory.value[i].exitTime = new Date(parkingHistory.value[i].exitTime);
  }
})

</script>