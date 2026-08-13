<script setup>
    const route = useRoute();
    const lotId = route.params.lot;
    const { parkedCars, totalIncome, parkingHistory, TOTAL_CAPACITY, remainingCapacity, handleAddCar, removeCar, cancelCar, lotInfo } = useParkingLot(lotId);
</script>
<template>
    <div class="wrap">
        <header>
            <div>
                <div class="eyebrow">Ergelen Otoparkı</div>
                <h1>{{ lotInfo.name }}</h1>
                <NuxtLink to="/">Ana Sayfa</NuxtLink>
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