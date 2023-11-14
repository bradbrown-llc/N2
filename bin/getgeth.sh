# arguments are: $1 = version, like v1.11.0; $2 = first 4 bytes of commit, like e501b3b0
# get commit and version from https://github.com/ethereum/go-ethereum/tags
# this will download the linux binary of that geth version

cd $N2_PATH/bin
wget "https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-$1-$2.tar.gz"
id=$(ls | sed -ne 's/\.tar\.gz//p')
tar --strip-components=1 -xzf $id.tar.gz
rm *.tar.gz
rm COPYING
mv geth $id