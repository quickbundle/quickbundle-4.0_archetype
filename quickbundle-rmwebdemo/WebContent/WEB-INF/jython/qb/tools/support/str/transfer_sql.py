#coding=UTF-8
import os
from os.path import join
import sys
import re
import datetime
from os import listdir
from os.path import isdir, normpath
import math
import cPickle
import codecs
#from qb.tools.support.zip import zip_file
#from qb.tools.helper import date_helper
import codecs

start_time = datetime.datetime.now()
if len(sys.argv) < 4:
    print '''\
This program transfer file from one encode to another encode. 
Any number of files can be specified. 
String '*' match any char and it must be in the file name

Usage: transfer_file_encode.py -sencode1 -dencode2 file1 file2 ......

examples:
transfer_file_encode.py -sUTF-8 -dGBK folder1 folder2 ......
'''
#transfer_file_encode.py -sGBK -dUTF-8 ./**/*java
    sys.exit()
#init argv
s_encode = None
d_encode = None
for arg in sys.argv[1:]:
    if arg.startswith('-s'):
        s_encode = arg[2:].upper()
    elif arg.startswith('-d'):
        d_encode = arg[2:].upper()
    else:
        continue
    print 'option:', arg

transfer_count = 0
skip_count = 0
sub_count = 0
ignore_files = ()  

for arg in sys.argv[1:]:
    if arg.startswith('-s') or arg.startswith('-d'):
        continue
    #zip_file.create(arg + '/../' + os.path.split(arg)[1] + '_' + str(date_helper.get_datetime_number()) + '.zip', arg)

    if os.path.isfile(arg):
        f = open(arg, 'r')
        s = f.read()
        f.close()
        try:
            s2 = s.decode(s_encode).encode(d_encode)
            f2 = open(arg, "w")
            f2.write(s2)
            f2.close()
            transfer_count = transfer_count + 1
        except Exception:
            print str(sys.exc_info()[0]),
            print ', skiping ', arg
            skip_count = skip_count + 1
        
    #read eclipse project ignore list    
    eclipse_prefs = arg + '/.settings/org.eclipse.core.resources.prefs'
    if os.path.exists(eclipse_prefs):
        ignore_files = re.findall('encoding//([^=]+?)=.*?', open(eclipse_prefs, 'r').read())
        index = 0
        for ignore_file in ignore_files:
            if arg.endswith('/'):
                ignore_files[index] = arg + ignore_file
            else:
                ignore_files[index] = arg + '/' + ignore_file
            index = index + 1
        print 'ignore_files=', ignore_files
    for root,dirs,files in os.walk(arg):
        for filename in files:
            temp_file = join(root,filename)
            if ignore_files.__contains__(temp_file):
                print 'ignore ' + temp_file
                continue
            f = open(temp_file, 'r')
            s = f.read()
            f.close()
            #if s[:3] == codecs.BOM_UTF8:
                #s = s[3:]
            try:
                s2 = s.decode(s_encode).encode(d_encode)
                s2_original = s2
                print 'transfering ', temp_file
                if s_encode == 'GBK' or s_encode == 'GB2312':
                    p_encode = re.compile('''(gb2312|GBK)"''', re.IGNORECASE)
                    s2 = p_encode.sub('utf8', s2)
                if d_encode == 'GBK' or d_encode == 'GB2312':
                    if temp_file.endswith('xml') or temp_file.endswith('xsl'):
                        if re.search('''<\?xml[^>]+?encoding="''' + s_encode + '''"[^>]*?\?>''', s2, re.IGNORECASE):
                            p_encode = re.compile('''encoding="''' + s_encode + '''"''', re.IGNORECASE)
                            s2 = p_encode.sub('encoding="gb2312"', s2, 1)
                            print 'info: subing ' + str(p_encode.findall(s2_original, re.IGNORECASE)) + '-->' + 'encoding="gb2312"'
                            sub_count = sub_count + 1
                    elif temp_file.endswith('jsp') or temp_file.endswith('htm') or temp_file.endswith('html') or temp_file.endswith('shtml'):
                        if re.search('charset=' + s_encode, s2, re.IGNORECASE):
                            p_charset_jsp = re.compile('''contentType\s*?=\s*?"text/html;\s*?charset=''' + s_encode, re.IGNORECASE)
                            s2 = p_charset_jsp.sub('contentType="text/html; charset=GBK', s2, 2)
                            print 'info: subing ' + str(p_charset_jsp.findall(s2_original, re.IGNORECASE)) + '-->' + 'contentType="text/html; charset=GBK',
                            p_charset_meta = re.compile('''content\s*?=\s*?"text/html;\s*?charset=''' + s_encode, re.IGNORECASE)
                            s2 = p_charset_meta.sub('content="text/html; charset=gb2312', s2, 2)
                            print '; ' + str(p_charset_meta.findall(s2_original, re.IGNORECASE)) + '-->' + 'content="text/html; charset=gb2312'
                            sub_count = sub_count + 1
                        if re.search('pageEncoding="' + s_encode + '"', s2, re.IGNORECASE):
                            p_pageEncoding_jsp = re.compile('pageEncoding="' + s_encode + '"', re.IGNORECASE)
                            s2 = p_pageEncoding_jsp.sub('pageEncoding="GBK"', s2, 2)
                            print 'info: subing ' + str(p_pageEncoding_jsp.findall(s2_original, re.IGNORECASE)) + '-->' + 'pageEncoding="GBK"'
                f2 = open(temp_file, "w")
                f2.write(s2)
                f2.close()
                transfer_count = transfer_count + 1
            except Exception:
                print str(sys.exc_info()[0]),
                print ', skiping ', temp_file
                skip_count = skip_count + 1

print 'cost ', datetime.datetime.now() - start_time, ', skip_count=', skip_count, ', transfer_count=', transfer_count, ', sub_count=', sub_count