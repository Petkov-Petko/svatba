const fullNameEl = document.getElementById("fullname");
const inviteListEl = document.getElementById("inviteList");
const invitedHiddenEl = document.getElementById("invitedGuests");
const inviteHintEl = document.getElementById("inviteHint");
const stayInHotelEl = document.getElementById("stayInHotel");
const roomOptionsEl = document.getElementById("roomOptions");
const roomTypeEl = document.getElementById("roomType");
const form = document.getElementById("rsvpForm");
const button = form.querySelector("button");
const statusEl = document.getElementById("formStatus");

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



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    fullname: form.fullname.value,
    attendance: form.attendance.value,
    invitedGuests: selectedGuests,
    stayInHotel: form.stayInHotel.value,
    roomType: form.roomType.value,
    message: form.message.value,
  };

  try {
    // disable бутон
    button.disabled = true;
    button.textContent = "Изпраща се...";

    // loading текст
    statusEl.textContent = "Моля изчакайте...";
    statusEl.className = "form-status loading";

    await fetch("https://script.google.com/macros/s/AKfycby6idpwNopWBnEpkVWqZasC99alzt6k_HxPRoDC3C4zI5sm_h4SaEaYQJcauEzwmGV-Zw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // success
    statusEl.textContent = "✅ Успешно изпратихте вашето потвърждение!";
    statusEl.className = "form-status success";

    button.textContent = "Изпратено ✓";

    form.reset();
    selectedGuests = [];
    renderInviteList();

  } catch (err) {
    // error
    statusEl.textContent = "❌ Възникна грешка. Опитайте отново.";
    statusEl.className = "form-status error";

    button.disabled = false;
    button.textContent = "Изпрати";
  }
});

// card

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

  function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setVH();
  window.addEventListener('resize', setVH);