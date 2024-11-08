import { table } from "console";
import { ZigbeeDevice } from "./zigbeeDevice";

export class Lamp implements ZigbeeDevice{
    deviceId: string;
    ieee_address: string;
    endpoint: number;
    friendlyName: string;
    color_temp: number;
    brightness: number;
    color_mode: string;
    state: string;

    // Static set to store previously generated IEEE addresses
    private static generatedAddresses = new Set<string>();

    constructor(deviceId: string){
        this.deviceId = deviceId;
        this.ieee_address = this.generateUniqueIeeeAddress()
        this.friendlyName=this.ieee_address
        this.endpoint = 1
        this.color_temp = 209
        this.brightness = 180
        this.state = "ON"
        this.color_mode = "color_temp"
    }

        // Generate a unique IEEE address (64-bit, 16 characters in hex)
        private generateUniqueIeeeAddress(): string {
            let ieeeAddress;
            do {
                ieeeAddress = this.generateRandomIeeeAddress();
            } while (Lamp.generatedAddresses.has(ieeeAddress));
            
            // Add the new unique address to the set
            Lamp.generatedAddresses.add(ieeeAddress);
            return ieeeAddress;
        }
    
         // Generate a random IEEE address (64-bit, 16 characters in hex)
    private generateRandomIeeeAddress(): string {
        const hexPairs = [];
        for (let i = 0; i < 8; i++) {  // 8 pairs to make 16 hex characters for 64-bit address
            const hexPair = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            hexPairs.push(hexPair);
        }
        return `0x${hexPairs.join('').toLowerCase()}`;  // Concatenate pairs, add 0x prefix, lowercase format
    }

    
}