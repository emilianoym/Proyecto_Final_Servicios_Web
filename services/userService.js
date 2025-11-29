const Counter = require('../models/counterModel');
const Device = require('../models/deviceModel');

class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    // Get next ID
    async getNextUserId() {
        const counter = await Counter.findOneAndUpdate(
            { _id: 'users' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return counter.seq;
    }

    // Get all users
    async getAllUsers() {
        return await this.userModel.find();
    }

    // Get user by ID
    async getUserById(idUser) {
        const numericId = Number(idUser);

        const user = await this.userModel.findOne({ idUser: numericId });
        if (!user) throw new Error('Usuario no encontrado');

        const devices = await Device.find({ ownerId: numericId });

        return { user, devices };
    }

    // Validate create data
    async validateCreateData(data = {}) {
        const errors = [];

        if (!data.name) errors.push('El nombre es requerido');
        if (!data.email) errors.push('El email es requerido');
        else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.push('Email inválido');

        // Check duplicate email
        const emailExists = await this.userModel.findOne({ email: data.email });
        if (emailExists) errors.push('El email ya existe');

        if (!data.password) errors.push('La contraseña es requerida');
        else if (data.password.length < 6)
            errors.push('La contraseña debe tener al menos 6 caracteres');

        const validRoles = ['viewer', 'admin', 'technician'];
        if (data.role && !validRoles.includes(data.role))
            errors.push(`Rol inválido. Debe ser: ${validRoles.join(', ')}`);

        return errors;
    }

    // Validate update data
    async validateUpdateData(data = {}) {
        const errors = [];

        if (data.name && typeof data.name !== 'string')
            errors.push('El nombre debe ser texto');

        if (data.email && !/^\S+@\S+\.\S+$/.test(data.email))
            errors.push('Email inválido');

        if (data.email) {
            const emailExists = await this.userModel.findOne({ email: data.email });
            if (emailExists) errors.push('El email ya existe');
        }

        if (data.password && data.password.length < 6)
            errors.push('La contraseña debe tener al menos 6 caracteres');

        const validRoles = ['viewer', 'admin', 'technician'];
        if (data.role && !validRoles.includes(data.role))
            errors.push(`Rol inválido. Debe ser: ${validRoles.join(', ')}`);

        return errors;
    }

    // Create user
    async createUser(data) {
        const errors = await this.validateCreateData(data);
        if (errors.length > 0) throw new Error(errors.join(', '));

        const newId = await this.getNextUserId();
        data.idUser = newId;

        const newUser = new this.userModel(data);
        return await newUser.save();
    }

    // Update user
    async updateUser(idUser, data) {
        if (data.id || data._id || data.idUser)
            throw new Error('No se puede modificar el ID');

        const errors = await this.validateUpdateData(data);
        if (errors.length > 0) throw new Error(errors.join(', '));

        const updatedUser = await this.userModel.findOneAndUpdate(
            { idUser: Number(idUser) },
            { $set: data },
            { new: true }
        );

        if (!updatedUser) throw new Error('Usuario no encontrado para actualizar');

        return updatedUser;
    }

    // Delete user
    async deleteUser(idUser) {
        const numericId = Number(idUser);

        const deviceExists = await Device.findOne({ ownerId: numericId });
        if (deviceExists)
            throw new Error('No se puede eliminar el usuario porque tiene dispositivos asociados');

        const deletedUser = await this.userModel.findOneAndDelete({ idUser: numericId });
        if (!deletedUser) throw new Error('Usuario no encontrado');

        return deletedUser;
    }
}

module.exports = UserService;
