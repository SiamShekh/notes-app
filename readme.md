const path = require('path');
const Loki = require('lokijs');

const dbPath = path.join(__dirname, 'mydb.json');

const adapter = new Loki.LokiFsAdapter();

const db = new Loki(dbPath, {
  adapter: adapter,
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 5000 // ms
});

function databaseInitialize() {
  let users = db.getCollection('users');
  if (users === null) {
    users = db.addCollection('users');
  }
}
