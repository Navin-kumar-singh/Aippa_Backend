/* Disgnation Auto Assigner class*/


class DesigAssigner {
    slots = [];
    constructor(parkingSize) {
        this.slots = new Array(parkingSize).fill(null);
    }
    park(carId) {
        if (this.slots.every((slot) => slot !== null)) {
            return false;
        }
        for (let i = 0; i <= this.slots.length; i++) {
            const slot = this.slots[i];
            if (slot === null) {
                this.slots[i] = carId;
                return true;
            }
        }
    }
    remove(carId) {
        if (this.slots.every((slot) => slot !== carId)) {
            return false;
        }

        for (let i = 0; i <= this.slots.length; i++) {
            const slot = this.slots[i];

            if (slot === carId) {
                this.slots[i] = null;
                return true;
            }
        }
    }

    getSlots() {
        return this.slots;
    }

    getSize() {
        return this.slots.length;
    }

    getAvailable() {
        const availableSlots = this.slots.filter((s) => s === null).length;
        return availableSlots;
    }

    isFull() {
        return this.getAvailable() === 0;
    }
}

export default DesigAssigner;
