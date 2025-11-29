const express = require('express');
const router = express.Router();


const { deviceServices } = require('../services/indexService');

/**
 * @swagger
 * tags:
 *   - name: Devices
 *     description: Gestión de dispositivos
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Obtener todos los dispositivos
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Lista de dispositivos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Device"
 */
router.get('/', async (req, res, next) => {
    try {
        const devices = await deviceServices.getAllDevices();
        res.json(devices);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Obtener un dispositivo por ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const device = await deviceServices.getDeviceById(req.params.id);
        res.json(device);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Crear un nuevo dispositivo
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DeviceInput"
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const device = await deviceServices.createDevice(req.body);
        res.status(201).json(device);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/devices/{id}:
 *   patch:
 *     summary: Actualizar un dispositivo existente
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DeviceInput"
 *     responses:
 *       200:
 *         description: Dispositivo actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Dispositivo no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const device = await deviceServices.updateDevice(req.params.id, req.body);
        res.json(device);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Eliminar un dispositivo
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Dispositivo eliminado correctamente
 *       404:
 *         description: Dispositivo no encontrado
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const device = await deviceServices.deleteDevice(req.params.id);
        res.json({ message: 'Dispositivo eliminado correctamente', device });
    } catch (error) {
        next(error);
    }
});



/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Device:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65b3d21c8f1a2b0012345678"
 *         id_device:
 *           type: number
 *           example: 1
 *         serialNumber:
 *           type: string
 *           example: "SN-123456"
 *         model:
 *           type: string
 *           example: "ESP32-WROOM"
 *         ownerId:
 *           type: number
 *           example: 12345
 *         zoneId:
 *           type: number
 *           example: 1
 *         sensors:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de los sensores asociados
 *           example: ["673eaca98fb23f6cd2134a1b"]
 *         installedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:00:00Z"
 *         status:
 *           type: string
 *           enum: [active, maintenance, offline]
 *           example: "active"
 *
 *     DeviceInput:
 *       type: object
 *       required:
 *         - serialNumber
 *         - model
 *         - ownerId
 *         - zoneId
 *         - installedAt
 *         - status 
 *       properties:
 *         serialNumber:
 *           type: string
 *           example: "SN-987654"
 *         model:
 *           type: string
 *           example: "Arduino Uno WiFi"
 *         ownerId:
 *           type: number
 *           example: 67890
 *         zoneId:
 *           type: number
 *           example: 2
 *         installedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-02-20T14:30:00Z"
 *         status:
 *           type: string
 *           enum: [active, maintenance, offline]
 *           default: active
 *           example: "maintenance"
 */

module.exports = router;
