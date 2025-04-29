const { User } = require('../models/schemas');
const { hash } = require('bcrypt');

const getUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

const createUser = async (req, res) => {
    const { username, googleEmail, password, role, studentId } = req.body;

    const hashedPassword = password ? await hash(password, 10) : undefined;

    const user = new User({
        username,
        googleEmail,
        role,
        studentId: role === 'STUDENT' ? studentId : undefined,
        ...(hashedPassword && { password: hashedPassword }),
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
};

const updateUser = async (req, res) => {
    const { username, googleEmail, password, role, studentId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username;
    user.googleEmail = googleEmail;
    user.role = role;
    user.studentId = role === 'STUDENT' ? studentId : undefined;

    if (password) {
        user.password = await hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
};

const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
