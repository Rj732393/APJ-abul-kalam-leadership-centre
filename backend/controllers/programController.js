// controllers/programController.js
import poolPromise, { sql } from '../db.js';

export const getAllPrograms = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM programs ORDER BY sort_order ASC, id ASC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM programs WHERE id=@id');
    if (!result.recordset.length) return res.status(404).json({ error: 'Program nahi mila' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProgram = async (req, res) => {
  try {
    const { stage, title, description, sort_order } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required hai' });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('stage', sql.NVarChar, stage || '')
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar(sql.MAX), description || '')
      .input('sort_order', sql.Int, sort_order || 0)
      .query(`INSERT INTO programs (stage, title, description, sort_order)
              OUTPUT INSERTED.id
              VALUES (@stage, @title, @description, @sort_order)`);

    res.status(201).json({ id: result.recordset[0].id, stage, title, description, sort_order: sort_order || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, title, description, sort_order } = req.body;

    const pool = await poolPromise;
    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM programs WHERE id=@id');
    if (!existing.recordset.length) return res.status(404).json({ error: 'Program nahi mila' });

    await pool.request()
      .input('id', sql.Int, id)
      .input('stage', sql.NVarChar, stage || '')
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar(sql.MAX), description || '')
      .input('sort_order', sql.Int, sort_order || 0)
      .query('UPDATE programs SET stage=@stage, title=@title, description=@description, sort_order=@sort_order WHERE id=@id');

    res.json({ message: 'Program update ho gaya' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM programs WHERE id=@id');
    res.json({ message: 'Program delete ho gaya' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
