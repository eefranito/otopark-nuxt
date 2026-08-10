<template>
    <div class="panel-grid">
        <section class="panel">
          <p class="panel-label">Kapasite</p>
          <p class="capacity-readout">{{ carCount }} / {{ totalCapacity }}</p>
          <p class="capacity-status">
            <span>Boş yer</span>
            <strong>{{ remainingCapacity }}</strong> </p>
        </section>
        <section class="panel">
          <p class="panel-label">Toplam Kasa</p>
          <p class="capacity-readout">{{ totalIncome }} TL</p>
        </section>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  carCount: Number,
  totalCapacity: Number,
  totalIncome: Number,
});

const remainingCapacity = computed(() => props.totalCapacity - props.carCount);

</script>
