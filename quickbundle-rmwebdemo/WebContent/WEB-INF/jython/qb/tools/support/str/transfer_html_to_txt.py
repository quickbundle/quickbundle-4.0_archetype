#coding=utf-8
import re
import os.path
import os,zipfile
import sys
from os.path import join
from datetime import date
from time import time
from qb.tools.support.str import extract_text

default_encode = 'GBK'

for root,dirs,files in os.walk(sys.argv[1]):
    for filename in files:
        s = file(filename, 'r').read()
        s = extract_text.get_text_simple(unicode(s, default_encode, 'ignore'))
        s = s.encode(default_encode)
        f2 = file(filename + '.txt','w')
        f2.write(s)
        f2.close()
