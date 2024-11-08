import { number } from 'zod';
import { Device } from './device';
import { Sensor, TemperatureSensor, HumiditySensor, LightSensor, UptimeSensor, MacAddressSensor, WifiSignalSensor, BssidSensor, IpAddressSensor, ConnectedSsidSensor, BinarySensor, Switch, SensorState } from './sensors';

export class Eos implements Device{

    deviceId: string;
    name: string;
    sensors: Sensor<any>[];
    restartSwitch: Switch;
    lastUpdateTime: number;

    constructor(deviceId: string, name: string, temperature: number, light: number, humidity: number){

        this.deviceId=deviceId
        this.name = name
        this.lastUpdateTime = Date.now();

        const ip_address = this.generateRandomIpAddress();
        const mac_wifi_adress = this.generateRandomMacAddress();
        const connected_bssid = this.generateRandomMacAddress();
        

        this.sensors=[
            {name: 'temperature', state: temperature, status: SensorState.ONLINE} as TemperatureSensor,
            { name: 'humidity', state: humidity, status: SensorState.ONLINE } as HumiditySensor,
            { name: 'light', state: light, status: SensorState.ONLINE } as LightSensor,
            { name: 'uptime', state: 0, status: SensorState.ONLINE } as UptimeSensor,
            { name: 'mac_wifi_adress', state: mac_wifi_adress, status: SensorState.ONLINE } as MacAddressSensor,
            { name: 'wifi_signal', state: -49, status: SensorState.ONLINE } as WifiSignalSensor,
            { name: 'connected_bssid', state: connected_bssid, status: SensorState.ONLINE } as BssidSensor, //acess point mac adress
            { name: 'ip_address', state: ip_address, status: SensorState.ONLINE } as IpAddressSensor,
            { name: 'connected_ssid', state: 'microlabIoT', status: SensorState.ONLINE } as ConnectedSsidSensor,
            { name: 'pir', state: 'OFF', status: SensorState.ONLINE } as BinarySensor // Movement sensor
        ];

        this.restartSwitch = {
            name: 'Restart Switch',
            state: 'OFF',
            status: SensorState.ONLINE
        }
        
    }

        // Generate a random MAC address
        private generateRandomMacAddress(){
            const hexPairs = [];
            for (let i = 0; i < 6; i++) {
                const hexPair = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
                hexPairs.push(hexPair);
            }
            return hexPairs.join(':').toUpperCase();
        }
    
        // Generate a random IP address (e.g., 192.168.X.X or 10.X.X.X)
        private generateRandomIpAddress() {
            const octet1 = Math.floor(Math.random() * 256);
            const octet2 = Math.floor(Math.random() * 256);
            return `192.168.${octet1}.${octet2}`;
        }


}