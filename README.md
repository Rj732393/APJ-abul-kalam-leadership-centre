# APJ Abdul Kalam Centre — Admin Panel Setup

## Step 1 — Database banao
1. Apne MySQL server (`103.21.58.193`) me phpMyAdmin ya MySQL client kholo.
2. `backend/schema.sql` file poori copy karke run kar do. Ye database, sab tables (`site_settings`, `board_members`, `gallery_images`, `news`, `programs`) bana dega aur starting data bhi daal dega.

## Step 2 — Backend chalao
```bash
cd backend
npm install
npm start
```
- Server `http://localhost:5000` pe chalega.
- Terminal me `✅ MySQL database se connect ho gaya` dikhna chahiye — agar error aaye to DB credentials/firewall check karo (remote MySQL me tumhare local IP ko allow karna padta hai).
- Uploaded photos `backend/uploads/` folder me save hongi aur `http://localhost:5000/uploads/<filename>` se dikhengi.

## Step 3 — Admin panel kholo
`admin/index.html` ko seedha browser me double-click karke khol lo (ya VS Code Live Server se). Ye backend se automatically connect ho jayega (`admin/js/api.js` me `API_BASE = 'http://localhost:5000'` set hai).

Admin panel me 5 sections hain:
- **Dashboard** — total counts
- **Site Settings** — hero text, stats, about section, footer contact/socials
- **Advisory Board** — members add/edit/delete with photo upload
- **Gallery** — photos add/edit/delete with caption + color tint
- **News** — articles add/edit/delete with optional photo
- **Programmes** — 3-stage programme cards add/edit/delete

## Step 4 — Live server pe deploy karte waqt
`admin/js/api.js` me ye line badal do:
```js
const API_BASE = 'http://103.21.58.193:5000';   // ya jo bhi tumhara live backend URL ho
```

## Agla step — User (public) side
Abhi jo public HTML pages hain (`index.html`, `board.html`, `gallery.html`, `news.html`, `programs.html`) unme content hardcoded hai. Inko admin ke DB data se dynamically fill karwana agla step hai — jaise hi bologe, wo bhi bana deti hoon taki admin ka upload/edit turant user side pe dikhe.
