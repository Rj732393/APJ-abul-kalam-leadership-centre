// authGuard.js
// Har protected admin page ke sabse upar include karo

(function () {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'login.html';
  }
})();