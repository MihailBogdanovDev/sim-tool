"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const room_1 = require("./room");
const sateraito_1 = require("./sateraito");
const lamp_1 = require("./lamp");
const zigbeeGroup_1 = require("./zigbeeGroup");
class Building {
    constructor(buildingId, name, numFloors, officesPerFloor, eosPerRoom, sateraitosPerFloor, lightsPerOffice) {
        this.buildingId = buildingId;
        this.name = name;
        this.sateraitos = [];
        this.floors = this.createFloors(numFloors, officesPerFloor, eosPerRoom, sateraitosPerFloor, lightsPerOffice);
    }
    // Create floors with offices (rooms)
    createFloors(numFloors, officesPerFloor, eosPerRoom, sateraitosPerFloor, lightsPerOffice) {
        const floors = [];
        console.log(eosPerRoom);
        for (let i = 0; i < numFloors; i++) {
            console.log(`in create floors ${i}`);
            const floor = [];
            const sateraitoGroups = [];
            const allLampsForFloor = this.generateLampsForFloor(officesPerFloor, lightsPerOffice);
            for (let j = 0; j < officesPerFloor; j++) {
                const officeNumber = (j).toString().padStart(2, '0');
                const roomLamps = allLampsForFloor.splice(0, lightsPerOffice);
                const zigbeeGroup = new zigbeeGroup_1.ZigbeeGroup(roomLamps); // Pass lamps as members
                const room = new room_1.Room(`F${i}N${j}`, officeNumber, eosPerRoom, [zigbeeGroup]);
                zigbeeGroup.friendlyName = `office/${room.name}/group/light_01`; //Make work with multiple groups
                floor.push(room);
            }
            //floors.push(floor);
            for (let satIndex = 0; satIndex < sateraitosPerFloor; satIndex++) {
                const assignedRooms = floor.slice(satIndex * officesPerFloor / sateraitosPerFloor, (satIndex + 1) * officesPerFloor / sateraitosPerFloor);
                const zigbeeGroups = assignedRooms.map(room => room.zigbeeGroups[0]); // Get the ZigbeeGroup of each room later on make it work with multiple groups
                const satName = String(satIndex + 1).padStart(2, '0');
                const sateraito = new sateraito_1.Sateraito(`F${i}N${satIndex}`, satName, zigbeeGroups); // Pass rooms as groups
                sateraitoGroups.push(sateraito);
            }
            this.sateraitos.push(...sateraitoGroups); // Add Sateraitos of this floor to building Sateraitos list
            floors.push(floor);
        }
        console.log("FLOORS ARE:");
        console.log(floors);
        console.log("SATERAITOS ARE");
        console.log(this.sateraitos);
        return floors;
    }
    // Generate a specific number of lamps for each floor
    generateLampsForFloor(officesPerFloor, lightsPerOffice) {
        const lamps = [];
        const totalLamps = officesPerFloor * lightsPerOffice;
        for (let i = 0; i < totalLamps; i++) {
            const lampNumber = (i + 1).toString().padStart(2, '0');
            lamps.push(new lamp_1.Lamp(`lamp_${lampNumber}`));
        }
        return lamps;
    }
}
exports.Building = Building;
