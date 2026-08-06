import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import poolPromise, { sql } from '../db.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username aur password dono required hain' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM admins WHERE username=@username');

    if (!result.recordset.length) {
      return res.status(401).json({ error: 'Username ya password galat hai' });
    }

    const admin = result.recordset[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username ya password galat hai' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};