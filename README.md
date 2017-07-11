# Meraki Ionic Mobile App
An unofficial Meraki app that demonstrates the power of Meraki APIs. 


## Overview
The Meraki Dashboard API provides the ability to configure and monitor the network. The application attempts to demonstrate many of the API endpoints and how they can be leveraged. 

The application is written with Ionic 2, which is an open-source mobile framework based on Angular 2.

## Installation
### Pre-requisites
* NodeJS v6~
Install via Package manager
https://nodejs.org/en/download/package-manager/
* Ionic
```
npm install -g ionic cordova
```
You may need to add “sudo” in front of these commands to install the utilities globally

### Install 
```
git clone https://github.com/dexterlabora/meraki-ionic-app.git
cd meraki-ionic-app
npm install
```

### Run 
* Development in Browser
```
ionic serve
```
A browser will likely open to http://localhost:8100

* Development on Mobile with Ionic View
```
ionic upload
```
Use the Mobile Ionic View app to test your application.
https://view.ionic.io/


**Note:**
The Meraki API prevents cross site scripting by implementing CORS. The mobile app will work fine, but the browser environment will not return any results (404 error).

Use an API proxy like API Umbrella or Apigee.

* Meraki Dashboard account



# Current Progress
- Working on SSIDs


### Written by Cory Guynn, 2017
