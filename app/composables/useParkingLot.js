export function useParkingLot(lotId) {
    const parkedCars = useLocalStorage(`parkedCars-${lotId}`, []);
    const totalIncome = useLocalStorage(`totalIncome-${lotId}`, 0);
    const parkingHistory = useLocalStorage(`parkingHistory-${lotId}`, []);

    const lotInfo = LOTS[lotId];
    const TOTAL_CAPACITY = lotInfo.capacity;

    const remainingCapacity = computed(() => TOTAL_CAPACITY - parkedCars.value.length);

    return {
        parkedCars,
        totalIncome,
        parkingHistory,
        TOTAL_CAPACITY,
        remainingCapacity,
        handleAddCar,
        removeCar,
        cancelCar,
        lotInfo,
    };

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
        for (let i = 0; i < parkedCars.value.length; i++) {
            if (typeof parkedCars.value[i].entryTime === 'string') {
                parkedCars.value[i].entryTime = new Date(parkedCars.value[i].entryTime);
            }
        }
    }, { immediate: true, deep: true });

    watch(parkingHistory, () => {
        for (let i = 0; i < parkingHistory.value.length; i++) {
            if (typeof parkingHistory.value[i].entryTime === 'string') {
                parkingHistory.value[i].entryTime = new Date(parkingHistory.value[i].entryTime);
            }
            if (typeof parkingHistory.value[i].exitTime === 'string') {
                parkingHistory.value[i].exitTime = new Date(parkingHistory.value[i].exitTime);
            }
        }
    }, { immediate: true, deep: true });
}


