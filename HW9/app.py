# app.py
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

# Set the static folder to serve CSS files
app.static_folder = 'static'

@app.route('/')
def index():
    return send_from_directory('templates', 'home.html')

@app.route('/home.html')
def home():
    return send_from_directory('templates', 'home.html')

@app.route('/lessons.html')
def lessons():
    return send_from_directory('templates', 'lessons.html')

@app.route('/lesson2.html')
def lesson2():
    return send_from_directory('templates', 'lesson2.html')

@app.route('/lesson3.html')
def lesson3():
    return send_from_directory('templates', 'lesson3.html')

@app.route('/quiz1.html')
def quiz1():
    return send_from_directory('templates', 'quiz1.html')

@app.route('/quiz2.html')
def quiz2():
    return send_from_directory('templates', 'quiz2.html')

@app.route('/quiz3.html')
def quiz3():
    return send_from_directory('templates', 'quiz3.html')

@app.route('/mixing-game.html')
def mixing_game():
    return send_from_directory('templates', 'mixing-game.html')

if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(debug=True)