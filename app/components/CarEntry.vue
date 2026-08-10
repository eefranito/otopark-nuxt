<template>
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
</template>
<script setup>
    const emit = defineEmits(['add']);
    const plateValue = ref("");
    const plateRegex = /^(\d{2})([A-Z]{1,3})(\d{2,4})$/;

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
        emit('add', formattedPlate);
        plateValue.value = "";
    }
</script>
<style></style>