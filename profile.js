document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const catName = params.get("cat");

  fetch("data/kittens.json")
    .then((response) => response.json())
    .then((cats) => {
      const cat = cats.find((c) => c.name === catName);

      if (cat) {
        document.getElementById("profile-container").innerHTML = `
              <div class="profile nes-container is-rounded is-dark">
                <h2 class="nes-text is-success">Meet ${cat.name}!</h2>
                <div class="nes-container is-rounded is-light">
                  <img src="${cat.sprite}" alt="${cat.name}">
                </div>
                <p>${cat.profile}</p>
                <button type="button" class="nes-btn is-warning adopt-btn">Adopt ${cat.name}</button>
                <div id="embed-container" class="nes-container is-rounded is-dark" style="display: none; margin-top: 20px;">
                  <p class="nes-text is-primary">Embed this kitty on your site:</p>
                  <textarea class="nes-textarea embed-code" readonly></textarea>
                </div>
              </div>
            `;

        const adoptButton = document.querySelector(".adopt-btn");
        const embedContainer = document.getElementById("embed-container");
        const embedCodeTextarea = document.querySelector(".embed-code");

        // Adoption Counter Logic
        adoptButton.addEventListener("click", () => {
          if (!localStorage.getItem(`adopted_${cat.name}`)) {
            // Increase counter locally or via API
            increaseAdoptionCounter();

            // Mark as adopted
            localStorage.setItem(`adopted_${cat.name}`, true);

            // Display embed code
            embedContainer.style.display = "block";
            embedCodeTextarea.value = `
                <div class="kitten-bytes-widget">
                    <h3>Meet ${cat.name}!</h3>
                    <img src="${cat.sprite}" alt="${cat.name}" width="100px" height="100px">
                    <p>${cat.gender} / ${cat.age} years old</p>
                    <p><img src="./assets/images/pixel-heart.gif" /> ${cat.loves.join(" and ")}</p>
                </div>
                <style>
                    .kitten-bytes-widget {
                    font-family: 'Press Start 2P', cursive;
                    text-align: center;
                    background: #333;
                    color: #fff;
                    border: 2px solid #fff;
                    padding: 10px;
                    border-radius: 10px;
                    }
                    .kitten-bytes-widget img {
                    max-width: 150px;
                    height: auto;
                    }
                </style>
              `;
          } else {
            alert(`You have already adopted ${cat.name}!`);
          }
        });
      } else {
        document.getElementById("profile-container").innerHTML = `<p>Cat not found!</p>`;
      }
    });
});

function increaseAdoptionCounter() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://abacus.jasoncameron.dev/hit/kittenbytes/adopted");
  xhr.responseType = "json";
  xhr.onload = function () {
    document.getElementById("adopted").innerText = this.response.value;
  };
  xhr.send();
}
