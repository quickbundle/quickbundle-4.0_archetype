# -*- coding: utf-8 -*-
import sys
import re
import datetime
import math
import os
import traceback

from javax.servlet.http import HttpServlet
from org.quickbundle.project.init import RmConfig

encode = RmConfig.defaultEncode()
#log_file_encode = "gb18030"
log_file_encode='utf-8'

#custom log_para
default_log_para = None

valid_row_count = 0
max_row_count = 500
focus_row_count = 50

log_dic = {}

class test_web (HttpServlet):
    def doGet(self,request,response):
        self.doPost (request,response)

    def doPost(self,request,response):
        sys.setrecursionlimit(sys.maxint)
        out = response.getWriter()
        out.println('''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>test_web.py</title>
</head>

<body>''')
        out.println("hello, world!")
        out.println("你好!")
        
        out.println('''
</body>
</html>
''')

    def getServletInfo(self):
        return "Short Description"