const fullNameEl = document.getElementById("fullname");
const inviteListEl = document.getElementById("inviteList");
const invitedHiddenEl = document.getElementById("invitedGuests");
const inviteHintEl = document.getElementById("inviteHint");
const stayInHotelEl = document.getElementById("stayInHotel");
const roomOptionsEl = document.getElementById("roomOptions");
const roomTypeEl = document.getElementById("roomType");

let allowedGuests = [];
let selectedGuests = [];

function normalizeName(s) {
  return (s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function syncHidden() {
  invitedHiddenEl.value = selectedGuests.join(", ");
}

function renderInviteList() {
  inviteListEl.innerHTML = "";

  if (allowedGuests.length === 0) {
    inviteListEl.innerHTML = `<div class="invite-empty">Няма добавени гости (+1).</div>`;
    return;
  }

  allowedGuests.forEach((name) => {
    const id = "guest_" + name.replace(/\s+/g, "_").replace(/[^\w]/g, "");

    const row = document.createElement("label");
    row.className = "invite-item";
    row.setAttribute("for", id);

    const checked = selectedGuests.includes(name);

    row.innerHTML = `
      <input type="checkbox" id="${id}" ${checked ? "checked" : ""} />
      <span>${name}</span>
    `;

    const checkbox = row.querySelector("input");
    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        if (!selectedGuests.includes(name)) selectedGuests.push(name);
      } else {
        selectedGuests = selectedGuests.filter((n) => n !== name);
      }
      syncHidden();
    });

    inviteListEl.appendChild(row);
  });
}

function setAllowedGuestsForPerson(personName) {
  const key = normalizeName(personName);
  allowedGuests = inviteMap && inviteMap[key] ? inviteMap[key].slice() : [];

  // ресетваме избраното при промяна на името
  selectedGuests = [];
  syncHidden();

  if (key.length === 0) {
    inviteHintEl.textContent =
      "Напишете първо вашето име, за да видите разрешените гости.";
    renderInviteList();
    return;
  }

  if (allowedGuests.length === 0) {
    inviteHintEl.textContent = "За това име няма добавени гости (+1).";
    renderInviteList();
    return;
  }

  inviteHintEl.textContent = "Отбележете кои гости ще доведете.";
  renderInviteList();
}

// 1) Когато човекът пише своето име – обновяваме allowedGuests
let nameTimer = null;
fullNameEl.addEventListener("input", () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    setAllowedGuestsForPerson(fullNameEl.value);
  }, 180);
});

function toggleRoomOptions() {
  if (!stayInHotelEl || !roomOptionsEl || !roomTypeEl) return;

  const shouldShowRooms = stayInHotelEl.value === "yes";
  roomOptionsEl.hidden = !shouldShowRooms;
  roomTypeEl.required = shouldShowRooms;

  if (!shouldShowRooms) {
    roomTypeEl.value = "";
  }
}

if (stayInHotelEl) {
  stayInHotelEl.addEventListener("change", toggleRoomOptions);
  toggleRoomOptions();
}

const card = document.getElementById("card");
const intro = document.getElementById("intro");
const seal = document.getElementById("seal");

seal.addEventListener("click", () => {

  // 1️⃣ печатът изчезва
  seal.classList.add("hide");

  // 2️⃣ след малко започва отварянето
  setTimeout(() => {
    card.classList.add("open");
  }, 800);

  // 3️⃣ след края на анимацията махаме интрото
  setTimeout(() => {
    intro.style.display = "none";
  }, 1200);
});

// Custom scroll animation observer
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.screens');
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, {
    root: scrollContainer,
    threshold: 0.15,
    rootMargin: '-50px'
  });

  elements.forEach(el => observer.observe(el));
});