const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: 'Name, valid email and password (minimum 8 characters) are required' });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,role', [name.trim(), email.toLowerCase().trim(), hash]);
    res.status(201).json({ message: 'Account created', user: rows[0] });
  } catch (e) { if (e.code === '23505') return res.status(409).json({ error: 'Email is already registered' }); next(e); }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const { rows } = await db.query('SELECT id,name,email,password_hash,role FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ error: 'Invalid email or password' });
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    delete user.password_hash;
    res.json({ message: 'Login successful', token, user });
  } catch (e) { next(e); }
};
