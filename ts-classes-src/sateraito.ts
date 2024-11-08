import { number } from 'zod';
import { ZigbeeDevice} from './zigbeeDevice';
import { ZigbeeGroup } from './zigbeeGroup';
import { Room } from './room';

export class Sateraito{

    deviceId: string;
    name: string;
    devices: { endpoint: number, ieee_address: string }[]; //make into another class
    groups: ZigbeeGroup[];
    state: string;

    constructor(deviceId: string, name: string, groups: ZigbeeGroup[]){

        this.deviceId=deviceId
        this.name = name
        this.groups = groups
        this.devices = []
        this.pushDevices()
        this.state = "online"
    
    }

    private pushDevices(){

        console.log("GROUPS IN SATERAITO ARE")
        console.log(this.groups)
        this.devices = [];
        let i = 1;
        // Iterate over each group and push its devices to the devices array
        this.groups.forEach(group => {
           
            group.id = i;
            group.members.forEach(member => {
                this.devices.push({
                    endpoint: member.endpoint,
                    ieee_address: member.ieee_address
                })
            })
            i++;
        });
    }
}
// create random devices
// spread them out over groups e.g. 02/office/01
// append 