// controllers/galleryController.js
import poolPromise, { sql } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

export const getAllImages = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM gallery_images ORDER BY sort_order ASC, id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getImageById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM gallery_images WHERE id=@id');
    if (!result.recordset.length) return res.status(404).json({ error: 'Image nahi mili' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE - image required
export const createImage = async (req, res) => {
  try {
    const { caption, tint, sort_order } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image upload karna zaroori hai' });

    const image = `/uploads/${req.file.filename}`;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('caption', sql.NVarChar, caption || '')
      .input('image', sql.NVarChar, image)
      .input('tint', sql.NVarChar, tint || 'tint-navy')
      .input('sort_order', sql.Int, sort_order || 0)
      .query(`INSERT INTO gallery_images (caption, image, tint, sort_order)
              OUTPUT INSERTED.id
              VALUES (@caption, @image, @tint, @sort_order)`);

    res.status(201).json({ id: result.recordset[0].id, caption, image, tint, sort_order: sort_order || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - image optional
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, tint, sort_order } = req.body;

    const pool = await poolPromise;
    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM gallery_images WHERE id=@id');
    if (!existing.recordset.length) return res.status(404).json({ error: 'Image nahi mili' });

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
      .input('caption', sql.NVarChar, caption || '')
      .input('image', sql.NVarChar, image)
      .input('tint', sql.NVarChar, tint || 'tint-navy')
      .input('sort_order', sql.Int, sort_order || 0)
      .query('UPDATE gallery_images SET caption=@caption, image=@image, tint=@tint, sort_order=@sort_order WHERE id=@id');

    res.json({ message: 'Gallery image update ho gayi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM gallery_images WHERE id=@id');
    if (result.recordset.length && result.recordset[0].image) {
      const oldPath = path.join(uploadDir, path.basename(result.recordset[0].image));
      fs.unlink(oldPath, () => {});
    }
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM gallery_images WHERE id=@id');
    res.json({ message: 'Gallery image delete ho gayi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
