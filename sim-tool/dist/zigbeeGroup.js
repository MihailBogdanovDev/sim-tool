"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZigbeeGroup = void 0;
class ZigbeeGroup {
    constructor(members) {
        this.friendlyName = "";
        this.id = 1;
        this.status = "online";
        this.members = members;
    }
}
exports.ZigbeeGroup = ZigbeeGroup;
