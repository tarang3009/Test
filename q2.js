const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

let users = [
    { id: 1, username: 'user1', password: '$2a$10$oi1...' } 
];

app.post('/update-password', authenticateToken, async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = users.find(u => u.id === userId);
        if (!user) return res.send('User not found.');

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        res.status(204).send(); 
    } catch (error) {
        res.send('Error updating password.');
    }
});
