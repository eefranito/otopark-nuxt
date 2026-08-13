export function useParkingLotStorage(lotId) {
    const parkedCars = useLocalStorage(`parkedCars-${lotId}`, []);
    const totalIncome = useLocalStorage(`totalIncome-${lotId}`, 0);
    const parkingHistory = useLocalStorage(`parkingHistory-${lotId}`, []);

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

    return {
        parkedCars,
        totalIncome,
        parkingHistory,
    };
}