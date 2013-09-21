@ECHO OFF
cd target 

echo rename directory...
move build-rmwebdemo-4.0.0-bin eclipse
cd eclipse
move build-rmwebdemo-4.0.0 plugins
cd plugins

echo extract plugin jars...
call :extractJar org.quickbundle.mda.gc-4.0.0
call :extractJar org.quickbundle.mda.gp-4.0.0
call :extractJar org.quickbundle.mda.libs-4.0.0
call :extractJar org.quickbundle.mda.mvm-4.0.0

echo copy quickbundle-rmwebdemo...
cd ..\..\..\..\..\quickbundle-rmwebdemo
call mvn clean
cd ..
echo extract quickbundle-rmwebdemo.jar...
call jar cfM build/build-rmwebdemo/target/quickbundle-rmwebdemo.jar quickbundle-rmwebdemo
cd build\build-rmwebdemo\target\eclipse\plugins\org.quickbundle.mda.gp-4.0.0\t\j1
call jar xfM ../../../../../quickbundle-rmwebdemo.jar

goto :EOF  


:extractJar
setlocal
echo extracting %1
mkdir %1
cd %1
call jar xf ../%1.jar
cd ..
del %1.jar
endlocal&goto :EOF

:packageJar
setlocal
echo packeging %1
cd %1
call jar cf %1.jar *
move %1.jar ..
cd ..
rd /s/q %1
endlocal&goto :EOF

:packageJar1
setlocal
echo packeging %1

call jar uf %1.jar df org com


cd ..
rem rd /s/q %1
endlocal&goto :EOF



