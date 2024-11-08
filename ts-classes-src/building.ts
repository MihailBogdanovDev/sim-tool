import { Room } from "./room";
import {Eos} from './eos'
import { Sateraito } from "./sateraito";
import { Lamp } from "./lamp";
import { ZigbeeGroup } from "./zigbeeGroup";

export class Building{

    buildingId: string;
    name: string;
    floors: Room[][];//Has eoses // Each floor will contain an array of rooms //Maybe change to map/dictionary
    sateraitos: Sateraito[];
    
    constructor(buildingId: string, name: string, numFloors: number, officesPerFloor: number, eosPerRoom: number, sateraitosPerFloor: number, lightsPerOffice:number){
        this.buildingId = buildingId
        this.name = name
        this.sateraitos = []
        this.floors = this.createFloors(numFloors,officesPerFloor, eosPerRoom, sateraitosPerFloor, lightsPerOffice)
    }

     // Create floors with offices (rooms)
  private createFloors(numFloors: number, officesPerFloor: number, eosPerRoom: number, sateraitosPerFloor: number, lightsPerOffice: number): Room[][] {
    const floors: Room[][] = [];
  
    console.log(eosPerRoom)

    for (let i = 0; i < numFloors; i++) {
      console.log(`in create floors ${i}`)
      const floor: Room[] = [];
      const sateraitoGroups: Sateraito[] = [];

     const allLampsForFloor: Lamp[] = this.generateLampsForFloor(officesPerFloor, lightsPerOffice);

      for (let j = 0; j < officesPerFloor; j++) {
        
        const officeNumber = (j).toString().padStart(2, '0');
        const roomLamps = allLampsForFloor.splice(0, lightsPerOffice)

        const zigbeeGroup = new ZigbeeGroup(roomLamps); // Pass lamps as members

        const room = new Room(`F${i}N${j}`, officeNumber, eosPerRoom, [zigbeeGroup]);
        zigbeeGroup.friendlyName = `office/${room.name}/group/light_01`;  //Make work with multiple groups
        floor.push(room);
      }
      //floors.push(floor);

       for (let satIndex = 0; satIndex < sateraitosPerFloor; satIndex++) {
        const assignedRooms = floor.slice(satIndex * officesPerFloor / sateraitosPerFloor, (satIndex + 1) * officesPerFloor / sateraitosPerFloor);

        const zigbeeGroups = assignedRooms.map(room => room.zigbeeGroups[0]); // Get the ZigbeeGroup of each room later on make it work with multiple groups

      const satName = String(satIndex+1).padStart(2, '0');
        const sateraito = new Sateraito(`F${i}N${satIndex}`, satName, zigbeeGroups); // Pass rooms as groups
        sateraitoGroups.push(sateraito);
    }
    this.sateraitos.push(...sateraitoGroups); // Add Sateraitos of this floor to building Sateraitos list
    floors.push(floor);
    }
    console.log("FLOORS ARE:")
    console.log(floors)
    console.log("SATERAITOS ARE")
    console.log(this.sateraitos)
    return floors;
  }

      // Generate a specific number of lamps for each floor
      private generateLampsForFloor(officesPerFloor: number, lightsPerOffice: number): Lamp[] {
        const lamps: Lamp[] = [];
        const totalLamps = officesPerFloor * lightsPerOffice;

        for (let i = 0; i < totalLamps; i++) {
            
            const lampNumber = (i + 1).toString().padStart(2, '0');
            lamps.push(new Lamp(`lamp_${lampNumber}`));
        }

        return lamps;
    }


}


