const Device = require('../models/deviceModel');
const User = require('../models/userModel');
const Zone = require('../models/zoneModel');
const Counter = require('../models/counterModel');

class DeviceService {

    // Get next ID
    async getNextDeviceId() {
        const counter = await Counter.findOneAndUpdate(
            { _id: 'devices' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        return counter.seq;
    }

    // Validate data
    async validateDeviceData(data, isUpdate = false) {
        const errors = [];


        if (!isUpdate || data.serialNumber) {
            if (!data.serialNumber) errors.push('El serialNumber es requerido');
            else if (typeof data.serialNumber !== 'string') errors.push('El serialNumber debe ser texto');
        }
        if (data.serialNumber) {
            const deviceExists = await Device.findOne({ serialNumber: data.serialNumber });
            if (deviceExists) errors.push('El serialNumber ya existe');
        }


        if (!isUpdate || data.model) {
            if (!data.model) errors.push('El modelo es requerido');
            else if (typeof data.model !== 'string') errors.push('El modelo debe ser texto');
        }


        if (!isUpdate || data.ownerId !== undefined) {
            if (typeof data.ownerId !== 'number') errors.push('ownerId debe ser numérico');
            else {
                const user = await User.findOne({ idUser: data.ownerId });
                if (!user) errors.push('El usuario indicado no existe');
            }
        }


        if (!isUpdate || data.zoneId !== undefined) {
            if (typeof data.zoneId !== 'number') errors.push('zoneId debe ser numérico');
            else {
                const zone = await Zone.findOne({ id_zone: data.zoneId });
                if (!zone) errors.push('La zona indicada no existe');
            }
        }

        return errors;
    }

    // Create device
    async createDevice(data) {
        const errors = await this.validateDeviceData(data);
        if (errors.length > 0) throw new Error(errors.join(', '));

        // Assign ID
        const newId = await this.getNextDeviceId();
        data.id_device = newId;


        const newDevice = new Device(data);
        return await newDevice.save();
    }

    // Get all devices
    async getAllDevices() {
        return await Device.find();
    }

    // Get device by ID
    async getDeviceById(id_device) {
        const device = await Device.findOne({ id_device: Number(id_device) });
        if (!device) throw new Error('Dispositivo no encontrado');
        return device;
    }

    // Update device
    async updateDevice(id_device, data) {
        const errors = await this.validateDeviceData(data, true);
        if (errors.length > 0) throw new Error(errors.join(', '));

        if (data.zoneId) {
            const zone = await Zone.findOne({ id_zone: data.zoneId });
            data.location = zone.name;
        }

        const updated = await Device.findOneAndUpdate(
            { id_device: Number(id_device) },
            data,
            { new: true }
        );

        if (!updated) throw new Error('Dispositivo no encontrado');
        return updated;
    }

    // Delete device
    async deleteDevice(id_device) {
        const Sensor = require('../models/sensorModel');
        const sensorExists = await Sensor.findOne({ deviceId: Number(id_device) });
        if (sensorExists) {
            throw new Error('No se puede eliminar el dispositivo porque tiene sensores asociados');
        }
        const deleted = await Device.findOneAndDelete({ id_device: Number(id_device) });
        if (!deleted) throw new Error('Dispositivo no encontrado');

        return deleted;
    }
}

module.exports = DeviceService;
