### Destiny Trials Report - [www.DestinyTrialsReport.com](http://www.destinytrialsreport.com/)

[![Build Status](https://secure.travis-ci.org/SteffanLong/DestinyTrialsReport.svg)](http://travis-ci.org/DestinyTrialsReport/DestinyTrialsReport)
[![Dependency Status](https://david-dm.org/SteffanLong/DestinyTrialsReport.svg)](https://david-dm.org/DestinyTrialsReport/DestinyTrialsReport)
[![devDependency Status](https://david-dm.org/SteffanLong/DestinyTrialsReport/dev-status.svg)](https://david-dm.org/DestinyTrialsReport/DestinyTrialsReport#info=devDependencies)
[![bitHound Score](https://www.bithound.io/github/SteffanLong/DestinyTrialsReport/badges/score.svg)](https://www.bithound.io/github/DestinyTrialsReport/DestinyTrialsReport/master)

### Quick links
- [Installation](#installation)
    - [Mac OS X](#installation-on-mac-os-x)
    - [Debian & Ubuntu](#installation-on-debian--ubuntu)
- [Support](#support)
    - [Found a bug?](#found-a-bug)
- [Contributing to the project](#contributing-to-the-project)

# Installation

#### Installation on Mac OS X

Using homebrew, install node + npm
* brew install node

Install modules
* make sure node version is v0.12.7
* sudo npm install

Install bower packages
* bower install

Insert API Key
* Get an API key from [Bungie.net](https://www.bungie.net/en/User/API)
* Insert your API key towards the top of Gruntfile.js here:
```
var BUNGIE_API_KEY = 'API KEY GOES HERE'
```

Update the definition files
* sudo node manifest.js

Run Server
* grunt serve


#### Installation on Debian & Ubuntu

[Install Dependencies]
`sudo apt-get install git ruby ruby-dev`

[Update Gems & Install Compass]
`sudo gem update --system && gem install compass`

[Install Node Version Manager]
`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash`
OR
`wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash`

[Install NPM & node.js]
```
source ~/.profile
nvm install 0.12.7
nvm use 0.12.7
n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local
```

[Install NPM Modules]
```
sudo npm install grunt-cli bower -g
npm install
````

[Install Bower Components]
`bower install`

[Insert API Key]
* Get an API key from [Bungie.net](https://www.bungie.net/en/User/API)
* Insert your API key towards the top of Gruntfile.js here:
```
var BUNGIE_API_KEY = 'API KEY GOES HERE'
```


[Update the definition files]
`sudo node manifest.js`

[Run Server]
`grunt serve`

# Support

## Found a bug?
Please take a look at [CONTRIBUTING.md](CONTRIBUTING.md#you-think-youve-found-a-bug) and submit your issue [here](https://github.com/SteffanLong/DestinyTrialsReport/issues/new).


----


# Contributing to the project

We are always looking for the quality contributions! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guidelines.
