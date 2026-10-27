@echo off
set "JAVA_HOME=C:\Users\pawan kalyan\.tools\jdk-21"
set "PATH=%JAVA_HOME%\bin;C:\Users\pawan kalyan\.tools\apache-maven\bin;%PATH%"
"C:\Users\pawan kalyan\.tools\apache-maven\bin\mvn.cmd" %*
