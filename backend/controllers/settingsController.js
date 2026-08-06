// controllers/settingsController.js
// site_settings me hamesha ek hi row (id=1) rahegi - hero, stats, about, contact/footer

import poolPromise, { sql } from '../db.js';

export const getSettings = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM site_settings WHERE id=1');
    res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const b = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('hero_title', sql.NVarChar, b.hero_title)
      .input('hero_lead', sql.NVarChar(sql.MAX), b.hero_lead)
      .input('quote_text', sql.NVarChar(sql.MAX), b.quote_text)
      .input('quote_author', sql.NVarChar, b.quote_author)
      .input('stat1_num', sql.NVarChar, b.stat1_num)
      .input('stat1_label', sql.NVarChar, b.stat1_label)
      .input('stat2_num', sql.NVarChar, b.stat2_num)
      .input('stat2_label', sql.NVarChar, b.stat2_label)
      .input('stat3_num', sql.NVarChar, b.stat3_num)
      .input('stat3_label', sql.NVarChar, b.stat3_label)
      .input('stat4_num', sql.NVarChar, b.stat4_num)
      .input('stat4_label', sql.NVarChar, b.stat4_label)
      .input('about_heading', sql.NVarChar, b.about_heading)
      .input('about_desc', sql.NVarChar(sql.MAX), b.about_desc)
      .input('address', sql.NVarChar, b.address)
      .input('email', sql.NVarChar, b.email)
      .input('phone', sql.NVarChar, b.phone)
      .input('facebook_url', sql.NVarChar, b.facebook_url)
      .input('twitter_url', sql.NVarChar, b.twitter_url)
      .input('instagram_url', sql.NVarChar, b.instagram_url)
      .query(`UPDATE site_settings SET
                hero_title=@hero_title, hero_lead=@hero_lead, quote_text=@quote_text, quote_author=@quote_author,
                stat1_num=@stat1_num, stat1_label=@stat1_label, stat2_num=@stat2_num, stat2_label=@stat2_label,
                stat3_num=@stat3_num, stat3_label=@stat3_label, stat4_num=@stat4_num, stat4_label=@stat4_label,
                about_heading=@about_heading, about_desc=@about_desc,
                address=@address, email=@email, phone=@phone,
                facebook_url=@facebook_url, twitter_url=@twitter_url, instagram_url=@instagram_url
              WHERE id=1`);

    res.json({ message: 'Settings update ho gayi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
