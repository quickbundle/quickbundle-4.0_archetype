#!/bin/sh

function extractJar()
{
  echo extracting $1
  mkdir $1
  cd $1
  jar xf ../$1.jar
  cd ..
  rm -f $1.jar
}

cd target 

echo rename directory...
mv build-rmwebdemo-4.0.0-bin eclipse
cd eclipse
mv build-rmwebdemo-4.0.0 plugins
cd plugins

echo extract plugin jars...
extractJar org.quickbundle.mda.gc-4.0.0
extractJar org.quickbundle.mda.gp-4.0.0
extractJar org.quickbundle.mda.libs-4.0.0
extractJar org.quickbundle.mda.mvm-4.0.0

echo copy quickbundle-rmwebdemo...
cd ../../../../../quickbundle-rmwebdemo
mvn clean eclipse:clean eclipse:eclipse
#mvn clean
cd ..
echo extract quickbundle-rmwebdemo.jar...
jar cfM build/build-rmwebdemo/target/quickbundle-rmwebdemo.jar quickbundle-rmwebdemo
cd build/build-rmwebdemo/target/eclipse/plugins/org.quickbundle.mda.gp-4.0.0/t/j1
jar xfM ../../../../../quickbundle-rmwebdemo.jar
