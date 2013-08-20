#coding=UTF-8
import os.path
import os,zipfile
from os.path import join
from datetime import date
from time import time
from qb.tools.helper import date_helper

default_encode = 'UTF-8'

class zip_file(object):
    def __init__(self, filename, mode='r', basedir=''):
        self.filename = filename
        self.mode = mode
        if self.mode in ('w', 'a'):
            self.zfile = zipfile.ZipFile(filename, self.mode, compression=zipfile.ZIP_DEFLATED)
        else:
            self.zfile = zipfile.ZipFile(filename, self.mode)
      
    def addfile(self, path):
        path = path.replace('\\', '/')
        basedir = os.path.dirname(path)
        
        empty_dirs=[]
        for root,dirs,files in os.walk(path):
            empty_dirs.extend([join(root,dir) for dir in dirs if os.listdir(join(root,dir))==[]])
            for filename in files:
                temp_file = join(root,filename) #.decode(default_encode)
                print "compressing",temp_file
                self.zfile.write(temp_file, temp_file[len(basedir):])
        for dir in empty_dirs:
            temp_dir = join(root,dir) + "/" #.decode(default_encode)
            zif=zipfile.ZipInfo(temp_dir[len(basedir):])
            self.zfile.writestr(zif,"")
        print "Finish compressing ", path
           
    def addfiles(self, paths):
        if isinstance(paths, list):
            for path in paths:
                self.addfile(path)
        else:
            self.addfile(paths)
           
    def close(self):
        self.zfile.close()
       
    def extract_to(self, path):
        target_dir = join(path, self.zfile.filename)
        if target_dir.endswith('.zip'):
            target_dir = target_dir[0:len(target_dir)-len('.zip')]
        if os.path.exists(target_dir):
            target_dir = target_dir + "_" + str(date_helper.get_datetime_number())
        for p in self.zfile.namelist():
            self.extract(p, target_dir)
           
    def extract(self, filename, path):
        if not filename.endswith('/'):
            f = os.path.join(path, filename)
            dir = os.path.dirname(f)
            if not os.path.exists(dir):
                os.makedirs(dir)
            file(f, 'wb').write(self.zfile.read(filename))
           
def create(zfile, files):
    z = zip_file(zfile, 'w')
    z.addfiles(files)
    z.close()
   
def extract(zfile, path):
    z = zip_file(zfile)
    z.extract_to(path)
    z.close()
    
#create('/home/qb/download/a.zip', ['/home/qb/download/jbossts/JBOSSTS_4_2_3_SP5', '/home/qb/download/todo/qb_dir'])
#create('/home/qb/download/b.zip', '/home/qb/download/jbossts/JBOSSTS_4_2_3_SP5')
#extract('/home/qb/download/a2', '/home/qb/download/')