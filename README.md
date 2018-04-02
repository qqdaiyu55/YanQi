**YanQi** is a p2p video sharing website which support online streaming.

## Installation

```Shell
# Tips: recommend centos 7, cause you might encounter some mistakes installing or running mongodb and elasticsearch on centos 6

yum install epel-release

# install stable 8.x nodejs
yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_8.x | bash -
yum install nodejs

# install yarn
wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
yum install yarn

# install pm2 and bittorrent-tracker
npm install pm2 -g
npm install -g bittorrent-tracker

# install elasticsearch
yum install java
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.4.rpm
rpm -ivh elasticsearch-5.6.4.rpm

# set elasticsearch
# for 1G memory server, the recommended setting is:
#  -Xms128m
#  -Xmx 256g
vim /etc/elasticsearch/jvm.options

# install elasticsearch plugin
/usr/share/elasticsearch/bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v5.6.4/elasticsearch-analysis-ik-5.6.4.zip
```

## Run

```
pm2 start index.js
```

