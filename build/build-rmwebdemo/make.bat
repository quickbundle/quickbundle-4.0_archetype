@ECHO OFF
cd target 
rem copy build-rmwebdemo-4.0.0.jar...
rem copy build-rmwebdemo-4.0.0.jar build-rmwebdemo-4.0.0-bin\build-rmwebdemo-4.0.0
cd build-rmwebdemo-4.0.0-bin\build-rmwebdemo-4.0.0
rem call :extractJar build-rmwebdemo-4.0.0

rem copy quickbundle-rmwebdemo...
xcopy /e/y/i ..\..\..\..\..\quickbundle-rmwebdemo quickbundle-rmwebdemo
cd quickbundle-rmwebdemo
call mvn clean
cd ..

rem extract plugin jars...
call :extractJar org.quickbundle.mda.gc-4.0.0
call :extractJar org.quickbundle.mda.gp-4.0.0
call :extractJar org.quickbundle.mda.libs-4.0.0
call :extractJar org.quickbundle.mda.mvm-4.0.0

rem move quickbundle-rmwebdemo...
move quickbundle-rmwebdemo org.quickbundle.mda.gp-4.0.0\t\j1

cd ..\..\
move build-rmwebdemo-4.0.0-bin eclipse
cd eclipse
move build-rmwebdemo-4.0.0 plugins

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



