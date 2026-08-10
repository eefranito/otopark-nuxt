export function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} saat ${minutes} dakika ${seconds} saniye`;
}

export function getDurationMinutes(entryTime) {
    return Math.floor(getDurationSeconds(entryTime) / 60);
}

export function getDurationSeconds(entryTime) {
    const now = new Date();
    const diffMs = now.getTime() - entryTime.getTime();
    return Math.floor(diffMs / 1000);
}

export function calculateFee(entryTime) {
    const diffMins = getDurationMinutes(entryTime);
    const hours = Math.ceil(diffMins / 60);
    let totalFee;
    if (diffMins < 15) {
        totalFee = 0;
    }
    else if (hours === 1) {
        totalFee = 200;
    }
    else {
        totalFee = 200 + (hours - 1) * 100;
    }
    return totalFee;
}