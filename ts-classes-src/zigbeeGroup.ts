import { ZigbeeDevice } from "./zigbeeDevice";

export class ZigbeeGroup{
    friendlyName: string;
    id: number;
    members: ZigbeeDevice[]; //change to members 
    status: string; //use enum for online or offline status

    constructor(members: ZigbeeDevice[]){
        this.friendlyName = ""
        this.id = 1
        this.status = "online"
        this.members = members
       
    }
}