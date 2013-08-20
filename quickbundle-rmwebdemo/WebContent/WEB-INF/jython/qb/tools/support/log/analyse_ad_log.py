#coding=utf-8
import os
import sys
import re
import datetime
from os import listdir
from os.path import isdir, normpath
import math
import cPickle
    
default_output_encode = 'utf-8'
arithmetic = '1' #定义模式, 1=普通, 2=序列化
max_date_hot_len = 2 #定义热date数组大小
read_n = 10 * 1024 * 1024 #定义文件每次读取byte数
temp_folder = '/' #定义临时文件目录

def len_all(dic_ip_dates):
    count = 0
    for temp_key_ip in dic_ip_dates:
        count = count + len(dic_ip_dates[temp_key_ip])
    return count

def sort_dict_len(dic, global_sql_dic = None, print_affix='ms'):
    s_count = sorted(dic.items(), cmp= lambda x,y:cmp(x,y), key=lambda dic: len_all(dic[1]), reverse = True)
    print 'order by find count in log:'
    for m in s_count:
        print '', m[0], '  count', len_all(m[1]),'  ipcount', len(m[1])
        
def sort_dict_value(dic, global_sql_dic = None, print_affix='ms'):
    s_count = sorted(dic.items(), key=lambda dic: dic[1], reverse = True)
    print 'order by find count in log:'
    for m in s_count:
        print '', m[0], '  count', m[1]

def merge_dic(dic_date_ad_ipcount):
    print 'merging...'
    dic_ad_ipcount = {}
    for key_date in dic_date_ad_ipcount:
        temp_dic_ad_ipcount = dic_date_ad_ipcount[key_date]
        for key_ad in temp_dic_ad_ipcount:
            if dic_ad_ipcount.has_key(key_ad):
                dic_ad_ipcount[key_ad] = dic_ad_ipcount[key_ad] + temp_dic_ad_ipcount[key_ad]
            else:
                dic_ad_ipcount[key_ad] = temp_dic_ad_ipcount[key_ad]
    return dic_ad_ipcount
def save_copy_remove_dic_date_hot(s_date):
    this_dic_date_hot = dic_date_hot_alone_ip[s_date]
    if os.path.exists(temp_folder + s_date):
        os.remove(temp_folder + s_date) #删除文件
    f = file(temp_folder + s_date, 'w') # Write to the file
    cPickle.dump(this_dic_date_hot, f) #dump the object to a file
    f.close()
    
    this_dic_date_result = {} #复制到dic_result
    for temp_ad_ips in this_dic_date_hot:
        this_dic_date_result[temp_ad_ips] = len(this_dic_date_hot[temp_ad_ips])
    dic_date_result_alone_ip[s_date] = this_dic_date_result #copy到dic_result
    
    del(dic_date_hot_alone_ip[s_date])
    
def load_remove_dic_date_result(s_date):
    print 'load ', s_date
    f = file(temp_folder + s_date) #Read back from the storage
    dic_date_hot_alone_ip[s_date] = cPickle.load(f)
    f.close()
    os.remove(temp_folder + s_date) #删除文件
    del(dic_date_result_alone_ip[s_date])
start_time = datetime.datetime.now()
print start_time.isoformat().replace('T', ' ')
if len(sys.argv) < 2:
    print '''\
This program analyse log files to the standard output. 
Any number of files can be specified. 
String '*' match any char and it must be in the file name

Usage: report_ad.py arithmetic target encode file1 file2 ......

arithmetic options include(default 1):
  -a1: dic in memory
  -a2: dic dump to file

target options include(default none):
  -malone_ip: analyse alone ip
  -malone_cookie: analyse alone cookie
  
encode format could be(default utf-8):
  -eGBK
  -eutf-8
  
examples:
analyse_log.py -a1 -malone_ip -eGBK /a.log* e:\logs\cms*log* >r.log
analyse_log.py -a2 -malone_cookie -eutf-8 /logs/cms*log*
'''
#analyse_log.py -malone_ip -malone_cookie -eutf-8 /logs/* /logs/cms*log* >r.log
    sys.exit()
#init argv
b_alone_ip = False
b_alone_cookie = False
for arg in sys.argv[1:]:
    if arg == '-a1':
        arithmetic = '1'
    elif arg == '-a2':
        arithmetic = '2'
    elif arg == '-malone_ip':
        b_alone_ip = True
    elif arg == '-malone_cookie':
        b_alone_cookie = True
    elif arg.startswith('-e'):
        default_output_encode = arg[2:]
    else:
        continue
    print 'option:', arg

#define arithmetic 1 dic
dic_alone_ip = {}
dic_alone_cookie = {}
#define arithmetic 2 dic
dic_date_result_alone_ip = {}
dic_date_hot_alone_ip = {}
l_date_hot = []
#define re pattern
ad_log = re.compile(r'''/(\d\w+?)\.htm\t([\d\.]+?)\t(\d{4}-\d{2}-\d{2}) [-:,\s\d]+?\t"[^"]+?"\t\d+?\t([\d\.]*)''')
for arg in sys.argv[1:]:
    if arg.startswith('-a') or arg.startswith('-e') or arg.startswith('-m'):
        continue
    fs = [];
    if(arg.find('*') > -1):
        match_arg = re.match(r'^(?P<parent>.*[/\\])(?P<file>[^/\\]+?)$', arg)
        if not os.path.exists(match_arg.group('parent')):
            continue
        filelist = listdir(match_arg.group('parent'))
        p_file = match_arg.group('file').replace('*', '.*')
        for temp_file in filelist:
            if re.match(p_file, temp_file, re.IGNORECASE):
                fs.append(match_arg.group('parent') + temp_file)
    else:
        fs.append(arg)
    for f_name in fs:
        print datetime.datetime.now().isoformat().replace('T', ' '), ' analysing ', f_name, '......'
        f = file(f_name, 'r')
        while True:
            print 'ok ', f.tell()/(1024*1024), 'M'
            s = f.read(read_n) + f.readline()
            if s == '':
                print 'file end, f.tell()=', f.tell()
                break
            logs = ad_log.findall(s)
            if arithmetic == '1':
                for log in logs:
                    if b_alone_ip:
                        if dic_alone_ip.has_key(log[0]):
                            td_ip_date = dic_alone_ip[log[0]]
                            if td_ip_date.has_key(log[1]):
                                if not td_ip_date[log[1]].__contains__(log[2]):
                                    td_ip_date[log[1]].append(log[2])
                            else:
                                td_ip_date[log[1]] = [log[2]]
                        else:
                            dic_alone_ip[log[0]] = {log[1]:[log[2]]}
                    if b_alone_cookie:
                        if dic_alone_cookie.has_key(log[0]):
                            td_cookie_date = dic_alone_cookie[log[0]]
                            if td_cookie_date.has_key(log[3]):
                                if not td_cookie_date[log[3]].__contains__(log[2]):
                                    td_cookie_date[log[3]].append(log[2])
                            else:
                                td_cookie_date[log[3]] = [log[2]]
                        else:
                            dic_alone_cookie[log[0]] = {log[3]:[log[2]]}
            elif arithmetic == '2':
                for log in logs:
                    if b_alone_ip:
                        if dic_date_hot_alone_ip.has_key(log[2]): #如果热dic有此日期
                            dic_ad_ips = dic_date_hot_alone_ip[log[2]] #取出此日期的dic并加入本条日志
                            if dic_ad_ips.has_key(log[0]):
                                if not dic_ad_ips[log[0]].has_key(log[1]):
                                    dic_ad_ips[log[0]][log[1]] = None
                            else:
                                dic_ad_ips[log[0]] = {log[1]:None}
                        elif dic_date_result_alone_ip.has_key(log[2]): #如果历史dic有此日期
                            print 'case 2 ', log[2]
                            l_date_hot.append(log[2]) #添加历史日期到l_date_hot
                            load_remove_dic_date_result(log[2]) #载入历史日期
                            dic_ad_ips = dic_date_hot_alone_ip[log[2]] #取出此日期的dic并加入本条日志
                            if dic_ad_ips.has_key(log[0]):
                                if not dic_ad_ips[log[0]].has_key(log[1]):
                                    dic_ad_ips[log[0]][log[1]] = None
                            else:
                                dic_ad_ips[log[0]] = {log[1]:None}
                            if(len(l_date_hot) > max_date_hot_len): #序列化历史记录
                                save_copy_remove_dic_date_hot(l_date_hot[0])
                                del(l_date_hot[0])
                        else: #如果是新日期
                            print 'case 3 ', log[2]
                            l_date_hot.append(log[2]) #添加新日期到l_date_hot
                            dic_date_hot_alone_ip[log[2]] = {log[0]:{log[1]:None}} #加入本条日志到dic_hot
                            if(len(l_date_hot) > max_date_hot_len): #序列化历史记录
                                save_copy_remove_dic_date_hot(l_date_hot[0])
                                del(l_date_hot[0])
                                
        f.close()
        print 'complate ', f_name , '!'
                    
#print sorted result
if arithmetic == '1':
    if b_alone_ip:
        print '\n', datetime.datetime.now().isoformat().replace('T', ' '), ' alone ip statistic:'
        sort_dict_len(dic_alone_ip)
    if b_alone_cookie:
        print '\n', datetime.datetime.now().isoformat().replace('T', ' '), ' alone cookie statistic:'
        sort_dict_len(dic_alone_cookie)
elif arithmetic == '2':
    if b_alone_ip:
        for date_hot in l_date_hot:
            save_copy_remove_dic_date_hot(date_hot)
        print '\n', datetime.datetime.now().isoformat().replace('T', ' '), ' alone ip statistic:'
        sort_dict_value(merge_dic(dic_date_result_alone_ip))
    for date_result in dic_date_result_alone_ip:
        if os.path.exists(temp_folder + date_result):
            os.remove(temp_folder + date_result) #删除文件
            print 'delete ', date_result
    print datetime.datetime.now().isoformat().replace('T', ' '), 'remove temp files ok!'
print datetime.datetime.now().isoformat().replace('T', ' ')
print 'cost ', datetime.datetime.now() - start_time

