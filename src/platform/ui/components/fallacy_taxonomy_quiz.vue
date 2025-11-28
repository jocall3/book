```vue
<template>
  <div class="fallacy-quiz">
    <h2>Fallacy Taxonomy Quiz</h2>
    <p>Test your knowledge of the Logic Police's Fallacy Taxonomy!</p>

    <div v-if="currentQuestionIndex < questions.length">
      <p><strong>Question {{ currentQuestionIndex + 1 }}:</strong> {{ currentQuestion.text }}</p>
      <ul>
        <li v-for="(answer, index) in currentQuestion.answers" :key="index">
          <button @click="selectAnswer(index)">{{ answer.text }}</button>
        </li>
      </ul>
      <p v-if="feedback" class="feedback">{{ feedback }}</p>
    </div>

    <div v-else>
      <p>Quiz Complete!</p>
      <p>Your Score: {{ score }} / {{ questions.length }}</p>
      <button @click="resetQuiz">Restart Quiz</button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        {
          text: "Which fallacy involves attacking a person's character rather than addressing their argument?",
          answers: [
            { text: "Ad Hominem", correct: true },
            { text: "Appeal to Authority", correct: false },
            { text: "Straw Man", correct: false },
            { text: "False Dilemma", correct: false },
          ],
          explanation: "Ad Hominem is a personal attack, not a logical one.",
        },
        {
          text: "What fallacy presents only two options when more exist?",
          answers: [
            { text: "Appeal to Emotion", correct: false },
            { text: "False Dilemma", correct: true },
            { text: "Bandwagon Fallacy", correct: false },
            { text: "Slippery Slope", correct: false },
          ],
          explanation: "False Dilemma limits choices artificially.",
        },
        {
          text: "Which fallacy assumes that because one event followed another, the first event caused the second?",
          answers: [
            { text: "Appeal to Authority", correct: false },
            { text: "Post Hoc Ergo Propter Hoc", correct: true },
            { text: "Straw Man", correct: false },
            { text: "Red Herring", correct: false },
          ],
          explanation: "Post Hoc mistakes correlation for causation.",
        },
        {
          text: "What fallacy misrepresents someone's argument to make it easier to attack?",
          answers: [
            { text: "Ad Hominem", correct: false },
            { text: "Appeal to Ignorance", correct: false },
            { text: "Straw Man", correct: true },
            { text: "Hasty Generalization", correct: false },
          ],
          explanation: "Straw Man distorts the original argument.",
        },
        {
          text: "Which fallacy uses the opinions of experts to support a claim, even when those experts are not experts in the subject at hand?",
          answers: [
            { text: "Appeal to Emotion", correct: false },
            { text: "Appeal to Authority", correct: true },
            { text: "Bandwagon Fallacy", correct: false },
            { text: "Slippery Slope", correct: false },
          ],
          explanation: "Appeal to authority relies on expert opinions, even when irrelevant.",
        },
      ],
      currentQuestionIndex: 0,
      score: 0,
      feedback: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
  },
  methods: {
    selectAnswer(answerIndex) {
      const selectedAnswer = this.currentQuestion.answers[answerIndex];
      if (selectedAnswer.correct) {
        this.score++;
        this.feedback = "Correct! " + this.currentQuestion.explanation;
      } else {
        this.feedback = "Incorrect. " + this.currentQuestion.explanation;
      }
      setTimeout(() => {
        this.nextQuestion();
      }, 2000); // Display feedback for 2 seconds
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      this.feedback = null;
    },
    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.feedback = null;
    },
  },
};
</script>

<style scoped>
.fallacy-quiz {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 600px;
  margin: 20px auto;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

button:hover {
  background-color: #3e8e41;
}

.feedback {
  margin-top: 10px;
  font-style: italic;
  color: #777;
}
</style>
```