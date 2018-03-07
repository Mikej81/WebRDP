
# WebRDP [![GitHub version](https://badge.fury.io/gh/Mikej81%2FWebRDP.svg)](https://badge.fury.io/gh/Mikej81%2FWebRDP) [![Build Status](https://travis-ci.org/Mikej81/WebRDP.svg?branch=master)](https://travis-ci.org/Mikej81/WebRDP) [![Known Vulnerabilities](https://snyk.io/test/github/mikej81/webrdp/badge.svg)](https://snyk.io/test/github/mikej81/webrdp) [![bitHound Overall Score](https://www.bithound.io/github/Mikej81/WebRDP/badges/score.svg)](https://www.bithound.io/github/Mikej81/WebRDP) [![bitHound Dependencies](https://www.bithound.io/github/Mikej81/WebRDP/badges/dependencies.svg)](https://www.bithound.io/github/Mikej81/WebRDP/master/dependencies/npm) [![Code Climate](https://codeclimate.com/github/Mikej81/WebRDP/badges/gpa.svg)](https://codeclimate.com/github/Mikej81/WebRDP)

Web RDP Client using node-rdpjs, socket.io, (some)mstsc.js, and express

A bare bones example of an HTML5 web-based RDP. We use RDP as a client on a host to proxy a Websocket / Socket.io connection to an RDP server.

![alt text](https://i.imgur.com/ZD0XBkG.png "Screenshot")


## Instructions

Install:  

`git https://github.com/Mikej81/WebRDP.git`

`npm install`

`node app.js`

Uses basic credentials and IP from req.param.host.

Domain is hardcoded, will work on that and more error handling for tab/browser close, etc.

# Options
## Screen capture OnMouseClick
This is currently hardcoded, will add the option to enable/disable in config file and/or header value.

## GET request vars / params

* **domain/username/password** - BasicAuth
* **host** - passed via the URI /rdp/host/[host_ip]

## Config File Options

## Examples
usage:  http://localhost:4200/rdp/host/[RDP_HOST_IP]

## Todo
* Add keylogging to syslog on crlf, or whatever.
* Cleanup code.

## Contributing
Do it!

## Release History
_(Nothing yet)_

## License
Copyright (c) 2017 Mikej81
Licensed under the GPL license.
