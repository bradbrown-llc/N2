#!/bin/bash
cd $N2_PATH
datadir=$(mktemp -dt N2-chain-XXXXXXXXXXXXXXXX)
cp -rf /tmp/N2-root/keystore $datadir
cp $N2_PATH/lib/genesisTemplate.json $datadir/genesis.json
sed -i "s/\"CHAINID\"/7306922652984242176$(lib/get.mjs chainId)/" $datadir/genesis.json
sed -i "s/ADDRESS/$(lib/get.mjs rootAddress)/" $datadir/genesis.json
sed -i "s/GASLIMIT/$(lib/get.mjs gasLimit)/" $datadir/genesis.json
sed -i "s/ALLOC/$(lib/get.mjs rootAlloc)/" $datadir/genesis.json
"bin/$1" init --datadir $datadir $datadir/genesis.json
echo $datadir