const form = document.getElementById("calc-form");
const output = document.getElementById("output");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const a = Number(document.getElementById("a").value);
  const b = Number(document.getElementById("b").value);
  const op = document.getElementById("op").value;

  output.classList.remove("error");
  output.textContent = "Calculating...";

  try {
    const response = await fetch("/api/calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a, b, op }),
    });

    const data = await response.json();

    if (!response.ok) {
      output.classList.add("error");
      output.textContent = JSON.stringify(data, null, 2);
      return;
    }

    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.classList.add("error");
    output.textContent = JSON.stringify(
      { detail: "Request failed", error: String(error) },
      null,
      2
    );
  }
});
