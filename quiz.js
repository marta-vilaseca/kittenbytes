document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz");
  const submitButton = document.getElementById("submit");
  const resultContainer = document.getElementById("result-container");

  fetch("data/questions.json")
    .then((response) => response.json())
    .then((questions) => {
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffledQuestions.slice(0, 6);

      selectedQuestions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question", "nes-balloon", "is-dark");
        questionDiv.classList.add(index % 2 === 0 ? "from-left" : "from-right");

        questionDiv.innerHTML = `
            <p>${q.question}</p>
            <label>
              <input type="radio" class="nes-radio is-dark" name="q${index}" value="${q.answer1Value}" required>
              <span>${q.answer1}</span>
            </label>
            <label>
              <input type="radio" class="nes-radio is-dark" name="q${index}" value="${q.answer2Value}" required>
              <span>${q.answer2}</span>
            </label>
          `;
        quizContainer.prepend(questionDiv);
      });

      submitButton.disabled = false;
    });

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();

    const formData = new FormData(quizContainer);
    const results = {};

    formData.forEach((value) => {
      results[value] = (results[value] || 0) + 1;
    });

    fetch("data/kittens.json")
      .then((response) => response.json())
      .then((cats) => {
        let bestMatch = null;
        let highestScore = 0;

        cats.forEach((cat) => {
          let score = 0;
          cat.traits.forEach((trait) => {
            if (results[trait]) {
              score += results[trait];
            }
          });

          if (score > highestScore) {
            highestScore = score;
            bestMatch = cat;
          }
        });

        if (bestMatch) {
          // Redirect to profile page
          window.location.href = `profile.html?cat=${encodeURIComponent(bestMatch.name)}`;
        } else {
          alert("No perfect matches. Try again!");
        }
      });
  });
});
