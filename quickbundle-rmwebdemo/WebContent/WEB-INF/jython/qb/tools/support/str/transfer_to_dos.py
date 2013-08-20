#coding=UTF-8
import os
from os.path import join
import sys
import re
from qb.tools.helper import date_helper
from os import listdir
from os.path import isdir, normpath
import math
import cPickle
from qb.tools.support.zip import zip_file

import datetime
start_time = datetime.datetime.now()
count = 0
for arg in sys.argv[1:]:
    zip_file.create(arg + "/../_" + str(date_helper.get_datetime_number()) + '.zip', arg)
    for root,dirs,files in os.walk(arg):
        for filename in files:
            temp_file = join(root,filename)
            print 'transfering ',temp_file
            f = open(temp_file, 'r')
            s = f.read()
            f.close()
            #replace \n to \r\n
            s = re.sub('''(?<!\r)\n''', '''\r\n''', s)
            f2 = open(temp_file, "w")
            f2.write(s)
            f2.close()
            count = count + 1
print 'cost ', datetime.datetime.now() - start_time, ', count=', count