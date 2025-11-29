const Counter = require('../models/counterModel');
const Device = require('../models/deviceModel');
class ZoneService {
    constructor(zoneModel) {
        this.zoneModel = zoneModel;
    }

    async getAllZones() {
        return await this.zoneModel.find();
    }

    async getNextZoneId() {
        const counter = await Counter.findOneAndUpdate(
            { _id: 'zones' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return counter.seq;
    }

    async getZoneById(id_zone) {
        const zone = await this.zoneModel.findOne({ id_zone: Number(id_zone) });
        if (!zone) {
            throw new Error('Zona no encontrada');
        }
        const devices = await Device.find({ zoneId: Number(id_zone) });
        return { zone, devices };
    }

    // Validate data
    async validateZoneData(data = {}) {
        const errors = [];

        if (!data.name) {
            errors.push('El nombre de la zona es requerido');
        } else if (typeof data.name !== 'string') {
            errors.push('El nombre debe ser texto');
        } else if (data.name.trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }

        if (data.description !== undefined && data.description !== null) {
            if (typeof data.description !== 'string') {
                errors.push('La descripción debe ser texto');
            } else if (data.description.length > 500) {
                errors.push('La descripción es demasiado larga (máx 500 caracteres)');
            }
        }

        if (data.active !== undefined && typeof data.active !== 'boolean') {
            errors.push('El campo "active" debe ser verdadero o falso');
        }

        return errors;
    }

    // Create zone
    async createZone(data) {
        const errors = await this.validateZoneData(data);
        if (errors.length > 0) {
            throw new Error('Datos inválidos: ' + errors.join(', '));
        }

        const nextId = await this.getNextZoneId();
        data.id_zone = nextId;

        const newZone = new this.zoneModel(data);
        return await newZone.save();
    }

    // Update zone
    async updateZone(id_zone, data) {
        if (data.id || data._id || data.id_zone) {
            throw new Error('No se puede modificar el ID');
        }

        const errors = await this.validateZoneData(data);
        if (errors.length > 0) {
            throw new Error('Datos inválidos: ' + errors.join(', '));
        }

        const updatedZone = await this.zoneModel.findOneAndUpdate(
            { id_zone: Number(id_zone) },
            { $set: data },
            { new: true }
        );

        if (!updatedZone) {
            throw new Error('Zona no encontrada para actualizar');
        }

        return updatedZone;
    }

    // Delete zone
    async deletedZone(id_zone) {
        const numericId = Number(id_zone);

        // Check associated devices
        const Device = require('../models/deviceModel');
        const deviceExists = await Device.findOne({ zoneId: numericId });
        if (deviceExists) {
            throw new Error('No se puede eliminar la zona porque tiene dispositivos asociados');
        }
        const deletedZone = await this.zoneModel.findOneAndDelete({ id_zone: numericId });

        if (!deletedZone) {
            throw new Error('Zona no encontrada');
        }
        return deletedZone;
    }
}

module.exports = ZoneService;
