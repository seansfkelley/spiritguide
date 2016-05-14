# spiritgui.de

## Setup

First, `npm install`.

### Recipe Database

Spirit Guide reads from a CouchDB instance. You have to seed it with some initial data, but only once (or, rarely, if the data format changes significantly).

1. Install [CouchDB](http://couchdb.apache.org/) by your preferred method and run it.
2. Ensure that `config-development.json` points to your CouchDB instance (it uses the default port, so it should).
3. `npm run seed-database -- --force`

### App

As a React Native app, you'll be using the iOS Simulator.

1. `npm start`
2. Open the iOS simulator.
3. I don't know how to set up the iOS simulator with a react-native app if it's not already, so you'll have to figure that out.
