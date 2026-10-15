// Simple romantic auth using localStorage (for fun / demo, not production)
function showMsg(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.style.display = 'none', 4000);
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  if (btn) btn.textContent = show ? '🙈' : '👁️';
  input.focus();
}

function getUsers() {
  return JSON.parse(localStorage.getItem('playbook_users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('playbook_users', JSON.stringify(users));
}

function signupUser(name, email, whatsapp, password, confirmPassword) {
  // allow old call signupUser(name,email,password) just in case
  if (password === undefined) {
    password = whatsapp;
    whatsapp = '';
  }
  name = (name || '').trim();
  email = email.trim().toLowerCase();
  whatsapp = (whatsapp || '').trim();
  if (name.length < 2) {
    showMsg('error', 'Please tell us your name / nickname 💕');
    return;
  }
  if (!whatsapp || !/^[+0-9][0-9\s\-()]{6,20}$/.test(whatsapp)) {
    showMsg('error', 'Please enter a valid WhatsApp number 📱');
    return;
  }
  if (!password || password.length < 6) {
    showMsg('error', 'Password must be at least 6 characters 🔐');
    return;
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    showMsg('error', "Passwords don't match. Please enter same password twice 💔");
    return;
  }
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showMsg('error', 'This email already has a love story. Try login 💔');
    return;
  }
  users.push({ name, email, whatsapp, password: btoa(password) });
  saveUsers(users);
  localStorage.setItem('playbook_current', email);
  showMsg('success', 'Welcome, ' + name + '! Redirecting to your story... 💖');
  setTimeout(() => window.location.href = 'home.html', 1200);
}

function loginUser(email, password) {
  email = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user || user.password !== btoa(password)) {
    showMsg('error', 'Hmm... wrong email or password. Try again 💔');
    return;
  }
  localStorage.setItem('playbook_current', email);
  window.location.href = 'home.html';
}

function logout() {
  localStorage.removeItem('playbook_current');
  window.location.href = 'login.html';
}

function currentUser() {
  const email = localStorage.getItem('playbook_current');
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}

// Owner WhatsApp - all Yes clicks go here (no hardcoded default)
const DEFAULT_OWNER_WHATSAPP = "";
function cleanWhatsapp(num) {
  return (num || '').replace(/[^0-9]/g, '');
}
function getOwnerWhatsapp() {
  const saved = localStorage.getItem('playbook_owner_whatsapp');
  const cleaned = cleanWhatsapp(saved || "");
  return cleaned.length >= 7 ? cleaned : "";
}
function setOwnerWhatsapp(num) {
  const cleaned = cleanWhatsapp(num);
  if (cleaned.length < 7) {
    showMsg('error', 'Enter a valid owner WhatsApp number 📱');
    return false;
  }
  localStorage.setItem('playbook_owner_whatsapp', cleaned);
  showMsg('success', 'Owner number saved: +' + cleaned + ' 💚');
  return true;
}

function createHearts() {
  const container = document.getElementById('hearts');
  if (!container) return;
  const emojis = ['❤️','💖','💕','🤍','🌹','💘'];
  for (let i = 0; i < 25; i++) {
    const s = document.createElement('span');
    s.className = 'heart-float';
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    s.style.left = Math.random()*100 + 'vw';
    s.style.fontSize = (12 + Math.random()*24) + 'px';
    s.style.animationDuration = (6 + Math.random()*8) + 's';
    s.style.animationDelay = (Math.random()*8) + 's';
    container.appendChild(s);
  }
}
