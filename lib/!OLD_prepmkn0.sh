#!/bin/bash
cd $N2_PATH
echo $(lib/get.mjs rootSecret) > /tmp/N2-key
echo '' > /tmp/N2-password
mkdir /tmp/N2-root 2> /dev/null && \
    (echo ''; echo '') | "bin/$1" --lightkdf --datadir /tmp/N2-root account import /tmp/N2-key \
|| ( until [ -d /tmp/N2-root/keystore ]; do sleep 1; done )