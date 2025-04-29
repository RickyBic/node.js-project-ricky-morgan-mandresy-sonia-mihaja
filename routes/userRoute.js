const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

router.get('/', requireRole(['ADMIN']), getUsers);
router.get('/:id', requireRole(['ADMIN']), getUserById);
router.post('/', requireRole(['ADMIN']), createUser);
router.put('/:id', requireRole(['ADMIN']), updateUser);
router.delete('/:id', requireRole(['ADMIN']), deleteUser);

module.exports = router;
