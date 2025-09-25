document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameChangeForm = document.getElementById("usernameChangeForm");

  //Login form
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    try {
      const res = await fetch("/loginAttempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const text = await res.text();

      if (text.includes("Welcome")) {
        if(text.includes("Welcome!")) {
            alert("New account created for user " + username)
        }
        sessionStorage.setItem("username", username);
        window.location.href = "/index.html";
      } else {
        alert("Login failed. Try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error.");
    }
  });

  //Username change form
  usernameChangeForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const oldUsername = usernameChangeForm.oldUsername.value.trim();
    const newUsername = usernameChangeForm.newUsername.value.trim();
    const password = usernameChangeForm.password.value.trim();

    try {
        const res = await fetch("/changeUsername", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldUsername, newUsername, password })
        });

        const text = await res.text();
        if(text.includes("Changed")) {
            sessionStorage.setItem("username", newUsername);
            window.location.href = "/index.html";
        } else {
            alert("Username change failed. Try again.")
        }
    } catch (err) {
      console.error("Username change error:", err);
      alert("Network error.");
    }
  });
});
