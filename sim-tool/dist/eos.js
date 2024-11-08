"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eos = void 0;
const sensors_1 = require("./sensors");
class Eos {
    constructor(deviceId, name, temperature, light, humidity) {
        this.deviceId = deviceId;
        this.name = name;
        this.lastUpdateTime = Date.now();
        const ip_address = this.generateRandomIpAddress();
        const mac_wifi_adress = this.generateRandomMacAddress();
        const connected_bssid = this.generateRandomMacAddress();
        this.sensors = [
            { name: 'temperature', state: temperature, status: sensors_1.SensorState.ONLINE },
            { name: 'humidity', state: humidity, status: sensors_1.SensorState.ONLINE },
            { name: 'light', state: light, status: sensors_1.SensorState.ONLINE },
            { name: 'uptime', state: 0, status: sensors_1.SensorState.ONLINE },
            { name: 'mac_wifi_adress', state: mac_wifi_adress, status: sensors_1.SensorState.ONLINE },
            { name: 'wifi_signal', state: -49, status: sensors_1.SensorState.ONLINE },
            { name: 'connected_bssid', state: connected_bssid, status: sensors_1.SensorState.ONLINE }, //acess point mac adress
            { name: 'ip_address', state: ip_address, status: sensors_1.SensorState.ONLINE },
            { name: 'connected_ssid', state: 'microlabIoT', status: sensors_1.SensorState.ONLINE },
            { name: 'pir', state: 'OFF', status: sensors_1.SensorState.ONLINE } // Movement sensor
        ];
        this.restartSwitch = {
            name: 'Restart Switch',
            state: 'OFF',
            status: sensors_1.SensorState.ONLINE
        };
    }
    // Generate a random MAC address
    generateRandomMacAddress() {
        const hexPairs = [];
        for (let i = 0; i < 6; i++) {
            const hexPair = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            hexPairs.push(hexPair);
        }
        return hexPairs.join(':').toUpperCase();
    }
    // Generate a random IP address (e.g., 192.168.X.X or 10.X.X.X)
    generateRandomIpAddress() {
        const octet1 = Math.floor(Math.random() * 256);
        const octet2 = Math.floor(Math.random() * 256);
        return `192.168.${octet1}.${octet2}`;
    }
}
exports.Eos = Eos;
