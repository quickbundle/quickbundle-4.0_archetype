#coding=utf-8
import urllib2
import re
import sys

def get_str_from_url(url, encode=None, default_encode='utf-8', opener=urllib2.build_opener()):
    #print url
    try:
        req = urllib2.Request(url)
        req.add_header('User-Agent','Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; CIBA)')
        s = opener.open(req).read()
    except:
        return re.sub('<|>', '', str(sys.exc_info()[0]))
    if(encode == None):
        encode = default_encode
        m_charset = re.search('<meta\s*http-equiv="?Content-Type"? content="text/html;\s*charset=([\w\d-]+?)"', s, re.IGNORECASE)
        if m_charset != None:
            encode = m_charset.group(1)
        if encode.upper().endswith("GB2312"):
            encode = 'GBK'
    return s.decode(encode, 'ignore')