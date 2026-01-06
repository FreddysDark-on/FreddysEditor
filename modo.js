// Seleccionar elementos
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Leer preferencia guardada o usar por defecto modo oscuro
let theme = localStorage.getItem('theme') || 'dark';
document.body.classList.toggle('light', theme === 'light');
updateIcon();

// Cambiar tema al hacer clic
toggleBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  theme = isLight ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  updateIcon();
});

// Actualizar icono
function updateIcon() {
  if (document.body.classList.contains('light')) {
    themeIcon.src = 'assets/hud/modeOn.png'; // ☀️ modo claro
  } else {
    themeIcon.src = 'assets/hud/modeOff.png'; // 🌙 modo oscuro
  }
}
