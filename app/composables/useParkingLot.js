export function useParkingLot(lotId) {
    const lotInfo = LOTS[lotId];
    const TOTAL_CAPACITY = lotInfo.capacity;

    const { parkedCars, totalIncome, parkingHistory } = useParkingLotStorage(lotId);
    const { removeCar, cancelCar, handleAddCar } = useParkingLotActions(parkedCars, totalIncome, parkingHistory);
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
}


