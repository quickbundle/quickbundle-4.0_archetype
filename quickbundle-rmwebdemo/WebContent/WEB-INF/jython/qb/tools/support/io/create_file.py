#coding=utf-8
import os
import sys
import re
import datetime
start_time = datetime.datetime.now()
print start_time.isoformat().replace('T', ' ')
s = file(sys.argv[1]).read()
f2 = file(sys.argv[2],"w")
count = 0
while count < int(sys.argv[3]):
    f2.write(s)
    count = count + 1
f2.close()
print datetime.datetime.now().isoformat().replace('T', ' ')
print 'cost ', datetime.datetime.now() - start_time