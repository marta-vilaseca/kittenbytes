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
      <img src="https://kittenbytes.vercel.app/assets/images/kittens/${cat.sprite}" alt="${cat.name}">
    </div>
    <p>${cat.profile}</p>
    <button type="button" class="nes-btn is-warning adopt-btn">Adopt ${cat.name}</button>
    <div id="embed-container" class="nes-container is-rounded is-dark" style="display: none; margin-top: 20px;">
    <h3 class="nes-text is-success">Thank you for giving ${cat.name} a good home! <img src="./assets/images/pixel-heart.gif" /></h3>  
    <p class="nes-text is-primary">Embed this kitty on your site:</p>
      <textarea class="nes-textarea embed-code" readonly rows="3"></textarea>
      <p class="nes-text is-success">Preview:</p>
      <div id="widget-preview" style="margin-top: 10px;"></div>
    </div>
  </div>
`;

        const adoptButton = document.querySelector(".adopt-btn");
        const embedContainer = document.getElementById("embed-container");
        const embedCodeTextarea = document.querySelector(".embed-code");

        adoptButton.addEventListener("click", () => {
          if (!localStorage.getItem(`adopted_${cat.name}`)) {
            increaseAdoptionCounter();
            localStorage.setItem(`adopted_${cat.name}`, true);

            embedContainer.style.display = "block";
            const embedCode = `<div class="kitten-bytes-widget">
              <h3>Hi, I'm ${cat.name}!</h3>
              <img src="https://kittenbytes.vercel.app/assets/images/kittens/${cat.sprite}" alt="${cat.name}" width="100px" height="100px">
              <p>I'm ${cat.age} years old, I <img src="https://kittenbytes.vercel.app/assets/images/pixel-heart.gif" /> ${cat.loves.join(" and ")}</p>
              <p><a href="https://kittenbytes.vercel.app/" target="_blank">Adopt your kitten!</a></p>
            </div>
            <style>
              .kitten-bytes-widget {
                margin: 10px auto;
                font-family: monospace, 'Courier New', Courier;
                text-align: center;
                background: #333;
                color: #fff;
                border: 2px solid #fff;
                padding: 10px;
                border-radius: 10px;
                width: 300px;
              }
              .kitten-bytes-widget h3 {
                margin: 10px 0;
                font-size: 20px;
                font-weight: 600;
              }
              .kitten-bytes-widget p {
                font-size: 16px;
                margin: 10px 0;
              }
              .kitten-bytes-widget img {
                max-width: 120px;
                height: auto;
              }
              .kitten-bytes-widget a:link,
              a:visited {
                color: #03a6d5 !important;
                text-decoration: none;
              }
              .kitten-bytes-widget a:hover,
              a:active {
                text-decoration: underline;
              }
            </style>`
              .replace(/\n/g, " ")
              .replace(/\s{2,}/g, " ")
              .trim();

            embedCodeTextarea.value = embedCode;
            document.getElementById("widget-preview").innerHTML = embedCode;
          } else {
            alert(`You have already adopted ${cat.name}!`);
          }
        });

        embedCodeTextarea.addEventListener("input", () => {
          const preview = document.getElementById("widget-preview");
          preview.innerHTML = embedCodeTextarea.value;
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
