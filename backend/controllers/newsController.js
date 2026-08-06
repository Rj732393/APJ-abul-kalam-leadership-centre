// controllers/newsController.js
import poolPromise, { sql } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

export const getAllNews = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM news ORDER BY news_date DESC, id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM news WHERE id=@id');
    if (!result.recordset.length) return res.status(404).json({ error: 'News nahi mili' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE - image optional
export const createNews = async (req, res) => {
  try {
    const { title, news_date, content } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required hai' });

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('news_date', sql.Date, news_date || null)
      .input('content', sql.NVarChar(sql.MAX), content || '')
      .input('image', sql.NVarChar, image)
      .query(`INSERT INTO news (title, news_date, content, image)
              OUTPUT INSERTED.id
              VALUES (@title, @news_date, @content, @image)`);

    res.status(201).json({ id: result.recordset[0].id, title, news_date, content, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, news_date, content } = req.body;

    const pool = await poolPromise;
    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM news WHERE id=@id');
    if (!existing.recordset.length) return res.status(404).json({ error: 'News nahi mili' });

    let image = existing.recordset[0].image;
    if (req.file) {
      if (image) {
        const oldPath = path.join(uploadDir, path.basename(image));
        fs.unlink(oldPath, () => {});
      }
      image = `/uploads/${req.file.filename}`;
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('news_date', sql.Date, news_date || null)
      .input('content', sql.NVarChar(sql.MAX), content || '')
      .input('image', sql.NVarChar, image)
      .query('UPDATE news SET title=@title, news_date=@news_date, content=@content, image=@image WHERE id=@id');

    res.json({ message: 'News update ho gayi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM news WHERE id=@id');
    if (result.recordset.length && result.recordset[0].image) {
      const oldPath = path.join(uploadDir, path.basename(result.recordset[0].image));
      fs.unlink(oldPath, () => {});
    }
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM news WHERE id=@id');
    res.json({ message: 'News delete ho gayi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
