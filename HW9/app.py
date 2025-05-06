import os
import random
from datetime import datetime
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect,
    url_for,
    session,
)

if not os.path.exists("templates"):
    os.makedirs("templates")
if not os.path.exists("static"):
    os.makedirs("static")

app = Flask(__name__)
app.secret_key = "dev_secret_key_change_this_final"  #  for session management

app.static_folder = "static"

lessons = {
    1: {"template": "lesson1.html", "title": "Lesson 1: Color Wheel"},
    2: {"template": "lesson2.html", "title": "Lesson 2: Value"},
    3: {"template": "lesson3.html", "title": "Lesson 3: Color Schemes"},
}
quiz_questions = {
    1: {"template": "quiz1.html", "title": "Question 1", "correct_answer": "Tint"},
    2: {
        "template": "quiz2.html",
        "title": "Question 2",
        "correct_answer": "Complementary",
    },
    3: {"template": "quiz3.html", "title": "Question 3", "correct_answer": "Triadic"},
}
total_quiz_questions = len(quiz_questions)
total_lessons = len(lessons)


@app.route("/")
def index():
    # Initialize user session data
    session.clear()
    session["user_start_time"] = datetime.now().isoformat()
    # Use string keys for dictionaries within the session
    session["lesson_visits"] = {}
    session["quiz_answers"] = {}
    session["game_visits"] = {}  # Initialize game visits as well
    print(f"Session initialized: {session}")
    return render_template("home.html")


@app.route("/home.html")
def home():
    # Don't clear session here, only on '/'
    return render_template("home.html")


@app.route("/lesson/<int:lesson_id>")
def lesson(lesson_id):
    if lesson_id not in lessons:
        return "Lesson not found", 404

    lesson_info = lessons[lesson_id]

    # --- Store visit time using STRING key ---
    lesson_id_str = str(lesson_id)
    if "lesson_visits" not in session:
        session["lesson_visits"] = {}
    session["lesson_visits"][lesson_id_str] = datetime.now().isoformat()
    session.modified = True
    print(f"Accessed Lesson {lesson_id}. Session: {session}")

    # Determine next button text and URL
    if lesson_id < total_lessons:
        next_id = lesson_id + 1
        next_url = url_for("lesson", lesson_id=next_id)
        next_text = f"Next: Lesson {next_id} →"
    else:
        next_url = url_for("quiz", question_id=1)
        next_text = "Next: Quiz →"
    
    if lesson_id > 1:
        prev_id = lesson_id - 1
        prev_url = url_for("lesson", lesson_id=prev_id)
        prev_text = f"← Previous: Lesson {prev_id}"
    else:
        prev_url = url_for("home")
        prev_text = "← Home"

    return render_template(
        lesson_info["template"],
        prev_url=prev_url,
        prev_text=prev_text, 
        next_url=next_url,
        next_text=next_text,
        title=lesson_info["title"],
    )


@app.route("/quiz/<int:question_id>", methods=["GET", "POST"])
def quiz(question_id):
    if question_id not in quiz_questions:
        return "Quiz question not found", 404

    # --- Use STRING keys for session access ---
    question_id_str = str(question_id)
    prev_question_id_str = str(question_id - 1)

    # Initialize session sub-dicts if they don't exist
    if "quiz_answers" not in session:
        session["quiz_answers"] = {}

    # Navigation Control (using string keys for check)
    if question_id > 1 and prev_question_id_str not in session["quiz_answers"]:
        first_unanswered = 1
        while (
            str(first_unanswered) in session["quiz_answers"]
            and first_unanswered <= total_quiz_questions
        ):
            first_unanswered += 1

        print(
            f"Attempted out of order access to Q{question_id}. Redirecting to Q{first_unanswered}"
        )
        if first_unanswered <= total_quiz_questions:
            return redirect(url_for("quiz", question_id=first_unanswered))
        else:
            return redirect(url_for("results"))

    question_info = quiz_questions[
        question_id
    ]  # Access question data using integer key

    if request.method == "POST":
        answer = request.form.get("answer")
        if not answer:
            return render_template(
                question_info["template"],
                title=question_info["title"],
                error="Please select an answer.",
            )

        # --- Store the answer using STRING key ---
        session["quiz_answers"][question_id_str] = answer
        session.modified = True
        print(f"Answered Q{question_id}: {answer}. Session: {session}")

        # Determine the next route
        if question_id < total_quiz_questions:
            next_route = url_for("quiz", question_id=question_id + 1)
        else:
            next_route = url_for("results")

        return redirect(next_route)

    # GET request: Display the question
    print(f"Displaying Q{question_id}")
    # Pass question_id needed for form action URL in template
    return render_template(
        question_info["template"], title=question_info["title"], question_id=question_id
    )


@app.route("/results")
def results():
    if "quiz_answers" not in session:
        print("Session expired or quiz not started, redirecting home.")
        return redirect(url_for("index"))

    # Check completion using STRING keys
    first_unanswered = 1
    while (
        str(first_unanswered) in session["quiz_answers"]
        and first_unanswered <= total_quiz_questions
    ):
        first_unanswered += 1

    # If quiz not complete, redirect to the first unanswered question
    if first_unanswered <= total_quiz_questions:
        print(
            f"Quiz not complete ({len(session['quiz_answers'])}/{total_quiz_questions}), redirecting to Q{first_unanswered}."
        )
        return redirect(url_for("quiz", question_id=first_unanswered))

    score = 0
    user_answers = session["quiz_answers"]  # This now has string keys '1', '2', '3'

    # Calculate score
    for q_id_int, correct_info in quiz_questions.items():
        q_id_str = str(q_id_int)
        user_answer = user_answers.get(q_id_str)
        if user_answer == correct_info["correct_answer"]:
            score += 1

    print(
        f"Displaying results. Score: {score}/{total_quiz_questions}. Session data: {session}"
    )

    # --- FIX: Pass quiz_questions and user_answers to the template ---
    return render_template(
        "results.html",
        score=score,
        total_questions=total_quiz_questions,
        quiz_questions=quiz_questions,  # Pass the main questions data
        user_answers=user_answers,
    )  # Pass the user's answers (with string keys)


@app.route("/mixing-game.html")
def mixing_game():
    game_key = "mixing_game"  # Use a string key
    if "game_visits" not in session:
        session["game_visits"] = {}
    session["game_visits"][game_key] = datetime.now().isoformat()
    session.modified = True
    print(f"Accessed Mixing Game. Session: {session}")

    if not os.path.exists("templates/mixing-game.html"):
        # Create a basic placeholder if the file doesn't exist
        with open("templates/mixing-game.html", "w") as f:
            f.write(
                """<!DOCTYPE html><html><head><title>Mixing Game</title><link rel="stylesheet" href="/static/main.css"></head><body class="special-gothic"><header><h1>Color Theory 101</h1><nav><a href="/home.html">Home</a> <a href="/lesson/1">Lessons</a> <a href="/quiz/1">Quiz</a> <a href="/mixing-game.html">Games</a> <a href="#">Palette</a> <a href="#">About</a></nav></header><div class="content"><h1>Mixing Game</h1><p>Game content goes here.</p><div class="next-lesson-container"><a href="/home.html" class="next-lesson-button">Return Home</a></div></div></body></html>"""
            )

    return render_template("mixing-game.html")


@app.route("/lessons.html")
def lessons_redirect():
    return redirect(url_for("lesson", lesson_id=1))


@app.route("/quiz1.html")
def quiz1_redirect():
    return redirect(url_for("quiz", question_id=1))


@app.route("/quiz2.html")
def quiz2_redirect():
    return redirect(url_for("quiz", question_id=2))


@app.route("/quiz3.html")
def quiz3_redirect():
    return redirect(url_for("quiz", question_id=3))

@app.route('/new-target-color')
def new_target_color():
    # Example: Random greenish RGB
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    hex_color = f'#{r:02x}{g:02x}{b:02x}'
    return jsonify({'color': hex_color})


if __name__ == "__main__":
    print("Starting Flask application...")
    app.run(debug=True)
