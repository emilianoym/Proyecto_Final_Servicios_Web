const express = require('express');
const router = express.Router();


const { userServices } = require('../services/indexService');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios y su configuración
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res, next) => {
    try {
        const users = await userServices.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const user = await userServices.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const user = await userServices.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualizar un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const user = await userServices.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const user = await userServices.deleteUser(req.params.id);
        res.json({ message: 'Usuario eliminado correctamente', user });
    } catch (error) {
        next(error);
    }
});



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de MongoDB
 *           example: 60d0fe4f5311236168a109cc
 *         idUser:
 *           type: number
 *           description: ID numérico único
 *           example: 12345
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           description: Correo electrónico
 *           example: juan.perez@example.com
 *         role:
 *           type: string
 *           description: Rol del usuario
 *           enum: [viewer, admin, technician]
 *           example: viewer
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - id_number
 *       properties:
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan.perez@example.com
 *         password:
 *           type: string
 *           example: secretPassword123
 *         role:
 *           type: string
 *           enum: [viewer, admin, technician]
 *           default: viewer
 */

module.exports = router;
