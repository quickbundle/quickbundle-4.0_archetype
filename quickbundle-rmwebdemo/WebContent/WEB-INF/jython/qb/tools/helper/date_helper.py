from time import *

def get_datetime():
    myTime = strftime('%Y-%m-%d %H:%M:%S', localtime())
    return myTime

def get_datetime_number():
    myTime = strftime('%Y%m%d%H%M%S', localtime())
    return myTime