export function useParkingLotActions(parkedCars, totalIncome, parkingHistory) {
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


    return {
        removeCar,
        cancelCar,
        handleAddCar,
    };
}