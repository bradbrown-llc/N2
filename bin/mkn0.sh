#!/bin/bash

case $1 in
    --bootnodes) $BOOTNODES=$2; shift 2;;
    --maxpeers) $MAXPEERS=$2; shift 2;;
esac
${BOOTNODES:=''}
${MAXPEERS:=0}
[ -z $BOOTNODES ]; MINING=$?

cd $N2_PATH
lib/prepmkn0.sh $1
datadir=$(lib/prepnewdatadir.sh $1)
exec "bin/$1" \
    --bootnodes "" \
    --allow-insecure-unlock \
    --authrpc.port 0 \
    --datadir $datadir \
    --discovery.dns "" \
    --discovery.port 0 \
    --http \
    --http.addr '0.0.0.0' \
    --http.api eth,web3,net,debug \
    --http.corsdomain '*' \
    --http.port 0 \
    --http.vhosts '*' \
    --maxpeers 0 \
    --mine \
    --miner.etherbase $(lib/get.mjs rootAddress) \
    --miner.gasprice 1 \
    --nat none \
    --password /tmp/N2-password \
    --port 0 \
    --unlock $(lib/get.mjs rootAddress) \
    --verbosity 5