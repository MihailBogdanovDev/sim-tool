import { TemperatureSensor, HumiditySensor, LightSensor, UptimeSensor, 
    MacAddressSensor, WifiSignalSensor, BssidSensor, IpAddressSensor, 
    ConnectedSsidSensor, BinarySensor, Switch, 
    Sensor} from "./sensors";

export interface Device {
    deviceId: string;
    name: string;
    sensors: Sensor<any>[]; //maybe remove to make it more generic
    restartSwitch: Switch   //maybe remove to make it more generic
}