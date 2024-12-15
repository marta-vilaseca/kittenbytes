// get Random kittens
function getRandomKittens(kittens, limit) {
  for (let i = kittens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kittens[i], kittens[j]] = [kittens[j], kittens[i]];
  }

  return kittens.slice(0, limit);
}

// Render kittens
function renderKittens(kittens, limit = null, container) {
  // If a limit is provided, get a random selection; otherwise, use all kittens
  const selectedKittens = limit ? getRandomKittens(kittens, limit) : kittens;

  // Start building the table structure
  let tableHTML = `<table id="adoptable_kittens">`;

  // Loop through the selected kittens and create rows with 3 columns
  for (let i = 0; i < selectedKittens.length; i += 3) {
    tableHTML += `<tr>`; // Start a new row

    // Add up to 3 kittens in the row
    for (let j = 0; j < 3; j++) {
      const kitten = selectedKittens[i + j];

      if (kitten) {
        tableHTML += `
            <td>
              <div class="nes-container is-rounded is-dark">
                <div class="nes-container is-rounded is-light">
                  <img src="./assets/images/kittens/${kitten.sprite}" class="kitten" alt="${kitten.name}" />
                </div>
                <h3>${kitten.name}</h3>
                <a href="profile.html?cat=${encodeURIComponent(kitten.name)}" class="nes-btn">View</a>
              </div>
            </td>
          `;
      } else {
        // Fill empty cells if there are fewer than 3 kittens in the last row
        tableHTML += `<td></td>`;
      }
    }

    tableHTML += `</tr>`;
  }

  tableHTML += `</table>`;

  // Inject the table into the container
  container.innerHTML = tableHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;

  fetch("data/kittens.json")
    .then((response) => response.json())
    .then((kittens) => {
      if (pathname.includes("index.html") || pathname === "/") {
        // Render 6 random kittens for the homepage
        const container = document.getElementById("kittens-container");
        renderKittens(kittens, 6, container);
      } else if (pathname.includes("kittens.html")) {
        // Render all kittens for the kittens page
        const container = document.getElementById("all-kittens-container");
        renderKittens(kittens, null, container); // Passing null to render all
      }
    })
    .catch((error) => console.error("Error fetching kittens:", error));
});
