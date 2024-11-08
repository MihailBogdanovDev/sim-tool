"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const eos_1 = require("./eos");
class Room {
    constructor(roomId, name, eosPerRoom, zigbeeGroups) {
        this.roomId = roomId;
        this.name = name;
        this.temperature = 25.1;
        this.humidity = 10.1;
        this.light = 14.1;
        this.eosDevices = this.createEosDevices(eosPerRoom);
        this.zigbeeGroups = zigbeeGroups;
    }
    // Generate a new group ID by incrementing the last assigned group ID
    generateGroupID() {
        Room.lastGroupID += 1;
        return Room.lastGroupID.toString();
    }
    // Create the specified number of Eos devices for the room
    createEosDevices(eosPerRoom) {
        const devices = [];
        console.log("in create eos");
        for (let i = 0; i < eosPerRoom; i++) {
            const eosNumber = (i).toString().padStart(2, '0');
            const eosDevice = new eos_1.Eos(`eos_${this.roomId}_${i}`, `${eosNumber}`, this.temperature, this.humidity, this.light); // Assign a unique ID to each Eos device
            devices.push(eosDevice);
        }
        console.log("DEVICES:");
        console.log(devices);
        return devices;
    }
}
exports.Room = Room;
Room.lastGroupID = 0;
