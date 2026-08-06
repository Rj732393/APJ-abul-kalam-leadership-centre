// js/api.js
// Common API helper - sabhi admin pages isko use karte hain

// Live server pe deploy karte waqt yahi line badal dena, jaise:
// const API_BASE = 'http://103.21.58.193:5000';
const API_BASE = 'http://localhost:5000';

// Kisi bhi <img> ke liye poora URL banata hai (DB me sirf /uploads/xyz.jpg store hota hai)
function imgUrl(path) {
  if (!path) return '';
  return API_BASE + path;
}

// GET / DELETE jaise simple JSON requests ke liye
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = { method, headers: {} };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(API_BASE + endpoint, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kuch galat ho gaya');
  return data;
}

// POST / PUT jab photo upload bhi karni ho (FormData use hota hai)
async function apiUpload(endpoint, method, formData) {
  const res = await fetch(API_BASE + endpoint, { method, body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kuch galat ho gaya');
  return data;
}

// Success/error message dikhane ke liye
function showMsg(elId, text, type = 'success') {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.className = 'msg ' + type;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// Mobile sidebar toggle - sab pages me same button
function initSidebarToggle() {
  const btn = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}
document.addEventListener('DOMContentLoaded', initSidebarToggle);
