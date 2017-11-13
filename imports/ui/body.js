import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    // Show newest tasks at the top
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task': function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);
    /*     // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
 */
    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input': function (event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});
