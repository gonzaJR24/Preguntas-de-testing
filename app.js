let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

// Cargar datos del JSON
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data.questions;
    renderQuestion();
  })
  .catch((error) => console.error("Error al cargar data.json:", error));

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  const quizContent = document.getElementById("quizContent");

  const optionsHTML = q.options
    .map(
      (option, index) => `
        <label class="option" id="option${index}">
          <input type="radio" name="answer" value="${index}" onchange="selectAnswer(${index})"
            ${userAnswers[currentQuestionIndex] === index ? "checked" : ""}>
          <span>${option}</span>
        </label>`
    )
    .join("");

  quizContent.innerHTML = `
    <div class="question-card">
      <div class="question-number">Pregunta ${currentQuestionIndex + 1} de ${questions.length}</div>
      <div class="question-text">${q.question}</div>
      <div class="options">${optionsHTML}</div>
    </div>
    <div class="navigation">
      <button class="btn btn-secondary" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? "disabled" : ""}>
        ← Anterior
      </button>
      <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()" 
        ${typeof userAnswers[currentQuestionIndex] === "undefined" ? "disabled" : ""}>
        ${currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente →"}
      </button>
    </div>
  `;

  updateStats();
}

function selectAnswer(index) {
  userAnswers[currentQuestionIndex] = index;

  const q = questions[currentQuestionIndex];
  const selectedOption = document.getElementById(`option${index}`);
  const correctOption = document.getElementById(`option${q.correct}`);

  document.querySelectorAll(".option").forEach((opt) => {
    opt.classList.remove("correct", "incorrect");
  });

  if (index === q.correct) {
    selectedOption.classList.add("correct");
  } else {
    selectedOption.classList.add("incorrect");
    correctOption.classList.add("correct");
  }

  document.getElementById("nextBtn").disabled = false;
  updateStats();
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    showResults();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

function updateStats() {
  const answeredCount = userAnswers.filter((a) => a !== undefined).length;
  const correctCount = userAnswers.filter(
    (a, i) => a === questions[i].correct
  ).length;

  document.getElementById("currentQuestion").textContent = currentQuestionIndex + 1;
  document.getElementById("correctAnswers").textContent = correctCount;
  document.getElementById("totalQuestions").textContent = questions.length;

  const progress = ((answeredCount) / questions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
}

function showResults() {
  const correctCount = userAnswers.filter(
    (a, i) => a === questions[i].correct
  ).length;
  const total = questions.length;
  const incorrect = total - correctCount;
  const percentage = Math.round((correctCount / total) * 100);

  const quizContent = document.getElementById("quizContent");
  const resultScreen = document.getElementById("resultScreen");

  quizContent.style.display = "none";
  resultScreen.classList.add("active");

  document.getElementById("resultScore").textContent = `${correctCount}/${total}`;
  document.getElementById("finalTotal").textContent = total;
  document.getElementById("finalCorrect").textContent = correctCount;
  document.getElementById("finalIncorrect").textContent = incorrect;
  document.getElementById("finalPercentage").textContent = percentage + "%";

  if (percentage >= 65) {
    document.getElementById("resultIcon").textContent = "🎉";
    document.getElementById("resultMessage").textContent = "¡Excelente trabajo!";
  } else if (percentage >= 40) {
    document.getElementById("resultIcon").textContent = "👍";
    document.getElementById("resultMessage").textContent = "¡Buen intento!";
  } else {
    document.getElementById("resultIcon").textContent = "📚";
    document.getElementById("resultMessage").textContent = "Sigue estudiando";
  }
}
