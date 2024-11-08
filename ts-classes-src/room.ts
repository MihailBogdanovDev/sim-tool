import { ZodBigIntCheck } from "zod";
import { Eos } from "./eos";
import { ZigbeeGroup } from "./zigbeeGroup";
import { ZigbeeDevice } from "./zigbeeDevice";
export class Room{

    roomId: string;
    name: string;
    temperature: number;
    humidity: number;
    light: number;
    eosDevices: Eos[];
    zigbeeGroups: ZigbeeGroup[];

    private static lastGroupID = 0;

    constructor(roomId: string, name: string, eosPerRoom: number, zigbeeGroups: ZigbeeGroup[]){
        this.roomId = roomId
        this.name = name
        this.temperature = 25.1;
        this.humidity = 10.1;
        this.light = 14.1;
        this.eosDevices = this.createEosDevices(eosPerRoom)
        this.zigbeeGroups = zigbeeGroups
    }

    // Generate a new group ID by incrementing the last assigned group ID
    private generateGroupID(): string {
      Room.lastGroupID += 1;
      return Room.lastGroupID.toString();
  }

     // Create the specified number of Eos devices for the room
  private createEosDevices(eosPerRoom: number): Eos[] {
    const devices: Eos[] = [];
    console.log("in create eos")
    for (let i = 0; i < eosPerRoom; i++) {
      const eosNumber = (i).toString().padStart(2, '0');
      const eosDevice = new Eos(`eos_${this.roomId}_${i}`, `${eosNumber}`, this.temperature, this.humidity, this.light); // Assign a unique ID to each Eos device
      devices.push(eosDevice);
    }
    console.log("DEVICES:")
    console.log(devices)
    return devices;
  }
}
