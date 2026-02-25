const fullNameEl = document.getElementById("fullname");
const inviteListEl = document.getElementById("inviteList");
const chipsEl = document.getElementById("chips");
const invitedHiddenEl = document.getElementById("invitedGuests");
const inviteHintEl = document.getElementById("inviteHint");

let allowedGuests = [];
let selectedGuests = [];

function normalizeName(s) {
  return (s || "").trim().replace(/\s+/g, " ");
}

function syncHidden() {
  invitedHiddenEl.value = selectedGuests.join(", ");
}

function renderChips() {
  if (!chipsEl) return;
  chipsEl.innerHTML = "";

  selectedGuests.forEach((name) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `<span>${name}</span>`;

    const x = document.createElement("button");
    x.type = "button";
    x.className = "x";
    x.setAttribute("aria-label", "Remove");
    x.textContent = "×";
    x.addEventListener("click", () => {
      selectedGuests = selectedGuests.filter((n) => n !== name);
      renderChips();
      renderInviteList(); // важно: да отрази махането и в чекбокса
      syncHidden();
    });

    chip.appendChild(x);
    chipsEl.appendChild(chip);
  });
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
      renderChips();
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
  renderChips();
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

// submit (оставям го както ти беше)
const formEl = document.getElementById("rsvpForm");
if (formEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "Формата е готова. За реално изпращане добави fetch към твой endpoint.",
    );
  });
}

// init
setAllowedGuestsForPerson("");
