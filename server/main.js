import { Meteor } from 'meteor/meteor';
// collections.js was stored at lib folder before, now it is at imports folder. need to import tasks.js
import '../imports/api/tasks.js';

Meteor.startup(() => {
  // code to run on server at startup
});
