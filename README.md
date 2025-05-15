# Color Theory 101

This is an interactive educational web app that teaches the basics of color theory in under 10 minutes. It includes lessons, quizzes with instant feedback, a color mixing game and a color wheel and tint / shade widget.

---

## How to Run the Project

### Make sure flask is installed

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run the App

Make sure you are in the ` UID/final` Directory

```bash
python app.py
```

Once running, visit `http://127.0.0.1:5000/` in your browser.

---

## Navigation Overview

- `/home.html` — Home Page
- `/lesson/1` — Lessons
- `/quiz/1` — Interactive quizzes
- `/results.html` — Final quiz results page
- `/mixing-game.html` — Hands-on color mixing game

## Folder Structure

```
final/
├── app.py
├── requirements.txt
├── templates/
│   ├── *.html
├── static/
├────── *js
│   └── main.css (styles)
```

---
