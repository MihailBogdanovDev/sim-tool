"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sateraito = void 0;
class Sateraito {
    constructor(deviceId, name, groups) {
        this.deviceId = deviceId;
        this.name = name;
        this.groups = groups;
        this.devices = [];
        this.pushDevices();
        this.state = "online";
    }
    pushDevices() {
        console.log("GROUPS IN SATERAITO ARE");
        console.log(this.groups);
        this.devices = [];
        let i = 1;
        // Iterate over each group and push its devices to the devices array
        this.groups.forEach(group => {
            group.id = i;
            group.members.forEach(member => {
                this.devices.push({
                    endpoint: member.endpoint,
                    ieee_address: member.ieee_address
                });
            });
            i++;
        });
    }
}
exports.Sateraito = Sateraito;
// create random devices
// spread them out over groups e.g. 02/office/01
// append 
