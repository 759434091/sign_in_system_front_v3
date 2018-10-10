#!/bin/bash

source ./private.sh

/usr/bin/expect << EOF
    set timeout -1
    spawn ssh ${USERNAME}@${HOST} -i ${KEYPATH}
    expect "*#"
        send "cd ${APPPATH}\r"
    expect "*#"
        send "rm -rf dist/\r"
    expect "*#"
        send "logout\r"
    expect eof
EOF

/usr/bin/expect << EOF
    set timeout -1
    spawn scp -i ${KEYPATH} -r ${DISTPATH} ${USERNAME}@${HOST}:${APPPATH}
    expect "ETA" {
        exp_continue;
    }
EOF

echo "upload success"
