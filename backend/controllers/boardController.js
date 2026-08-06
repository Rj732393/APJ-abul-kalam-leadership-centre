// controllers/boardController.js
import poolPromise, { sql } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// GET all board members
export const getAllMembers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM board_members ORDER BY sort_order ASC, id ASC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single member
export const getMemberById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM board_members WHERE id=@id');
    if (!result.recordset.length) return res.status(404).json({ error: 'Member nahi mila' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE member (photo optional)
export const createMember = async (req, res) => {
  try {
    const { name, role, sort_order } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required hai' });

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('role', sql.NVarChar, role || null)
      .input('photo', sql.NVarChar, photo)
      .input('sort_order', sql.Int, sort_order || 0)
      .query(`INSERT INTO board_members (name, role, photo, sort_order)
              OUTPUT INSERTED.id
              VALUES (@name, @role, @photo, @sort_order)`);

    res.status(201).json({ id: result.recordset[0].id, name, role, photo, sort_order: sort_order || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE member (photo optional - agar naya upload kiya to purani delete kar denge)
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, sort_order } = req.body;

    const pool = await poolPromise;
    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM board_members WHERE id=@id');
    if (!existing.recordset.length) return res.status(404).json({ error: 'Member nahi mila' });

    let photo = existing.recordset[0].photo;
    if (req.file) {
      if (photo) {
        const oldPath = path.join(uploadDir, path.basename(photo));
        fs.unlink(oldPath, () => {});
      }
      photo = `/uploads/${req.file.filename}`;
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('role', sql.NVarChar, role || null)
      .input('photo', sql.NVarChar, photo)
      .input('sort_order', sql.Int, sort_order || 0)
      .query('UPDATE board_members SET name=@name, role=@role, photo=@photo, sort_order=@sort_order WHERE id=@id');

    res.json({ message: 'Member update ho gaya' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM board_members WHERE id=@id');
    if (result.recordset.length && result.recordset[0].photo) {
      const oldPath = path.join(uploadDir, path.basename(result.recordset[0].photo));
      fs.unlink(oldPath, () => {});
    }
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM board_members WHERE id=@id');
    res.json({ message: 'Member delete ho gaya' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
