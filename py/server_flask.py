import sys
import platform
if platform.system() == 'Linux':
    sys.path.append('/home/it-new/miniconda3/lib/python3.12/site-packages')
from flask import Flask
from main_app import MyWidget
import random
from PySide6 import QtCore, QtWidgets, QtGui
from threading import Thread
import multiprocessing
import schedule
import time


app = Flask(__name__)

scheduler = schedule

@app.route("/")
def hello_world():
    print("hello_world")
    proc = multiprocessing.Process(target=run_schedule, args=()) 
    proc.start()
    return "<p>Hello, World asdasdaasdasd!</p>"

@app.route("/launch_qt", methods=["GET"])
def launch_qt():
    get_schedule = scheduler.get_jobs('schedule_test')
    if len(get_schedule) == 0:
        scheduler.every().day.at("13:00").do(spawn_qt).tag("schedule_test")
    all_jobs = scheduler.get_jobs()
    jobs = ''
    for job in all_jobs:
        jobs += str(job) + '\n'
    print(all_jobs)
    return f"<p>Launch Qt. {jobs}</p>"

def gui():
    # qt_app = QtWidgets.QApplication([])
    if not QtWidgets.QApplication.instance():
        qt_app = QtWidgets.QApplication(sys.argv)
    else:
        qt_app = QtWidgets.QApplication.instance()
    widget = MyWidget()
    widget.resize(800, 600)
    widget.show()
    sys.exit(qt_app.exec())

def spawn_qt():
    print("spawn_qt")
    proc = multiprocessing.Process(target=gui, args=()) 
    proc.start()
    
def run_schedule():
    # scheduler.every().day.at("13:00").do(spawn_qt).tag("schedule_test")
    # # schedule.every(5).seconds.do(spawn_qt).tag("schedule_test")
    all_jobs = scheduler.get_jobs()
    print(all_jobs)
    
    while True:
        scheduler.run_pending()
        time.sleep(1)
    
def job():
    print("job")