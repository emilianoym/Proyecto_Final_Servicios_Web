const express = require('express');
const router = express.Router();

const { zoneServices } = require('../services/indexService');

/**
 * @swagger
 * tags:
 *   - name: Zones
 *     description: Gestión de zonas geográficas
 */

/**
 * @swagger
 * /api/zones:
 *   get:
 *     summary: Obtener todas las zonas
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: Lista de zonas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zone'
 */
router.get('/', async (req, res, next) => {
    try {
        const zones = await zoneServices.getAllZones();
        res.json(zones);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /api/zones/{id}:
 *   get:
 *     summary: Obtener una zona por ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         example: 1
 *         required: true
 *         description: ID de la zona
 *     responses:
 *       200:
 *         description: Zona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: Zona no encontrada
 */
router.get('/:id', async (req, res, next) => {
    try {
        const zone = await zoneServices.getZoneById(req.params.id);
        res.json(zone);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /api/zones:
 *   post:
 *     summary: Crear una nueva zona
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZoneInput'
 *     responses:
 *       201:
 *         description: Zona creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const newZone = await zoneServices.createZone(req.body);
        res.status(201).json(newZone);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /api/zones/{id}:
 *   patch:
 *     summary: Actualizar una zona existente
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         example: 1
 *         required: true
 *         description: ID de la zona a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZoneInput'
 *     responses:
 *       200:
 *         description: Zona actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: Zona no encontrada
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const updatedZone = await zoneServices.updateZone(req.params.id, req.body);
        res.json(updatedZone);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /api/zones/{id}:
 *   delete:
 *     summary: Eliminar una zona
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         example: 1
 *         required: true
 *         description: ID de la zona a eliminar
 *     responses:
 *       200:
 *         description: Zona eliminada correctamente
 *       404:
 *         description: Zona no encontrada
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedZone = await zoneServices.deletedZone(req.params.id);
        res.json({ message: 'Zona eliminada correctamente', zone: deletedZone });
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Zone:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID generado automáticamente
 *           example: "65a123bc789def0012345678"
 *         id_zone:
 *           type: number
 *           description: ID numérico de la zona
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre de la zona geográfica
 *           example: "Zona Bajío"
 *         description:
 *           type: string
 *           description: Descripción de la zona
 *           example: "Zona industrial norte"
 *         isActive:
 *           type: boolean
 *           description: Esta activo
 *           example: true
 *
 *     ZoneInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Zona Centro"
 *         description:
 *           type: string
 *           example: "Centro histórico y comercial"
 *         isActive:
 *           type: boolean
 *           example: true
 */

module.exports = router;
