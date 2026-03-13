const activitySelect = document.getElementById("activity");
const form = document.getElementById("record-form");
const recordsEl = document.getElementById("records");
const weekMeta = document.getElementById("week-meta");

function translateStatus(value) {
  return value === "present" ? "Participou" : "Faltou";
}

function renderRecords(records) {
  recordsEl.innerHTML = "";

  records.forEach((record) => {
    const card = document.createElement("article");
    card.className = "record";

    const statusClass = record.status === "present" ? "present" : "absent";
    const updatedAt = record.updated_at ? new Date(record.updated_at).toLocaleString("pt-BR") : "Sem atualização";

    card.innerHTML = `
      <div class="row">
        <strong>${record.activity}</strong>
        <span class="badge ${statusClass}">${translateStatus(record.status)}</span>
      </div>
      <div class="meta">Humor: ${record.mood} · Atualizado: ${updatedAt}</div>
      <div class="note">${record.note || "Sem observações."}</div>
    `;

    recordsEl.appendChild(card);
  });
}

async function loadActivities() {
  const response = await fetch("/api/activities");
  const data = await response.json();

  activitySelect.innerHTML = data.activities
    .map((activity) => `<option value="${activity}">${activity}</option>`)
    .join("");
}

async function loadWeek() {
  const response = await fetch("/api/week");
  const data = await response.json();

  weekMeta.textContent = `${data.child_name} · Semana iniciada em ${data.week_start}`;
  renderRecords(data.records);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    status: document.getElementById("status").value,
    mood: document.getElementById("mood").value,
    note: document.getElementById("note").value,
  };

  const activity = activitySelect.value;

  const response = await fetch(`/api/week/${encodeURIComponent(activity)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.detail || "Falha ao salvar");
    return;
  }

  form.reset();
  await loadWeek();
});

loadActivities().then(loadWeek);
