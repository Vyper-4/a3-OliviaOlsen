// FRONT-END (CLIENT) JAVASCRIPT HERE
let currentUsername = sessionStorage.getItem("username") || "";

  async function submitRecord(event) {
    event.preventDefault();

    const json = {
      record: document.getElementById("recordType").value,
      year: Number(document.getElementById("year").value),
      holder: document.getElementById("name").value
    };

    if (currentUsername === document.getElementById("name").value) {
      try {
        const response = await fetch("/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json)
        });

        console.log(await response.text());
        checkRecords();
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("You are not signed in as this user!")
    }
  }

  async function expunge(record, holder, year) {
    if(holder === currentUsername) {
      try {
        const response = await fetch("/expunge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ record, holder, year: Number(year) })
        });
        console.log(await response.text());
        checkRecords();
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("You are not signed in as this user!")
    }
  }

  function attachEventListeners() {
    document.querySelector("form")?.addEventListener("submit", submitRecord);
    document.getElementById("myRecordsCheckbox")?.addEventListener("change", checkRecords);
    document.querySelector("#expungeButton")?.addEventListener("click", () => {
      expunge(
        document.getElementById("recordType").value,
        document.getElementById("name").value,
        document.getElementById("year").value
      );
    });
  }

  async function checkRecords() {
    try {
      const response = await fetch("/data");
      const data = await response.json();

      const pacmanEnt = document.getElementById("pacmanEnt");
      const galagaEnt = document.getElementById("galagaEnt");
      const snakeEnt = document.getElementById("snakeEnt");

      if (pacmanEnt) pacmanEnt.innerHTML = "";
      if (galagaEnt) galagaEnt.innerHTML = "";
      if (snakeEnt) snakeEnt.innerHTML = "";


      const onlyMine = document.getElementById("myRecordsCheckbox")?.checked || false;


      data.forEach(record => {
        if (onlyMine && record.holder !== currentUsername) return;

        if (currentUsername !== "") {
          document.getElementById("loginButton").innerText = "Hi, " + currentUsername;
        }

        const newRecord = document.createElement("li");
        //const br = document.createElement("br");
        newRecord.textContent = `${record.holder}, ${record.year}`;

        if (record.currentlyHeld) {
          newRecord.style.fontWeight = "bold";
          newRecord.style.color = "#4AF948";
        }

        const containerId = record.record + "Ent";
        //document.getElementById(containerId)?.appendChild(br);
        document.getElementById(containerId)?.appendChild(newRecord);
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  attachEventListeners();
  checkRecords();

// Initialization
window.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();

  if (currentUsername) {
    document.getElementById("loginButton").textContent = `Hi, ${currentUsername}`;
  }

  checkRecords();
});