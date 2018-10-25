<h1 align="center">
  <img src="https://i.imgur.com/YcgO3ST.png" alt="YANQI" width="200" align="center"/>
</h1>

<h4 align="center">An elegant P2P video sharing website, support online streaming.</h4>

## Screenshot

![screenshot](https://camo.githubusercontent.com/72b2859175a76ccca9938a0a6f090bc5be0f8ed7/68747470733a2f2f692e696d6775722e636f6d2f6c5555786464302e706e67)

## Install and run

#### Requirements

- Node
- MongoDB
- ElasticSearch (including the corresponding plugin)

```Shell
# Tips: recommend centos 7, cause you might encounter some mistakes installing or running mongodb and elasticsearch on centos 6

yum install epel-release

# install stable 8.x nodejs
yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_8.x | bash -
yum install nodejs

# optional: install pm2 and bittorrent-tracker
npm install pm2 -g
npm install -g bittorrent-tracker

# install elasticsearch
yum install java
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.4.rpm
rpm -ivh elasticsearch-5.6.4.rpm

# set elasticsearch
# for 1G memory server, the recommended setting is:
#  -Xms128m
#  -Xmx256m
vim /etc/elasticsearch/jvm.options

# install elasticsearch plugin
/usr/share/elasticsearch/bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v5.6.4/elasticsearch-analysis-ik-5.6.4.zip
```

#### Get the code

```shell
$ git clone git@github.com:qqdaiyu55/YanQi.git
$ cd YanQi
$ npm install
```

#### Compile for development or production

```shell
# For development
$ npm run dev

# For production
$ npm run build
```

#### Run

Before run the app, make sure you have started mongoDB and elasticsearch services.

```shell
$ npm run start
```

## Acknowledge

- [WebTorrent](https://webtorrent.io/)
- [react daily ui](https://github.com/fullstackreact/react-daily-ui)