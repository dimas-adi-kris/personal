import sys
sys.path.append('/home/it-new/miniconda3/lib/python3.12/site-packages')
import schedule
import time

class PersonalScheduler:
    def __init__(self):
        self.schedule = schedule
        self.jobs = []
        
    def __getattribute__(self, name):
        attr = super().__getattribute__(name)
        if callable(attr):
            super().__getattribute__('get_all_jobs')()
        return attr
        
    def run_schedule(self):
        while True:
            self.schedule.run_pending()
            time.sleep(1)
    
    def add_job(self, func, runtime, tag, *args, **kwargs):
        self.schedule.every().day.at(runtime).do(func, *args, **kwargs).tag(tag)
    
    def add_job_every_seconds(self, func, seconds, tag, *args, **kwargs):
        self.schedule.every(seconds).seconds.do(func, *args, **kwargs).tag(tag)
    
    def remove_job(self, tag):
        self.schedule.clear(tag)
    
    def get_jobs_by_tag(self, tag):
        return self.schedule.get_jobs(tag)
    
    def get_all_jobs(self):
        self.jobs = self.schedule.get_jobs()
        return self.jobs



def job():
    print(PS.get_all_jobs())
    print(PS.jobs)
    print("I'm working...")
    

# Run job every 3 second/minute/hour/day/week,
# Starting 3 second/minute/hour/day/week from now
# schedule.every(3).seconds.do(job)
PS = PersonalScheduler()
PS.add_job_every_seconds(job, 3, "schedule_test")
PS.run_schedule()

# while True:
    # schedule.run_pending()
    # time.sleep(1)