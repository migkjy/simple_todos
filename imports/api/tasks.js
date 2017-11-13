import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // this code only rens on the server
  // DB selection??
  // Calling Meteor.publish on the server registers a publication named "tasks"
  //   When Meteor.subscribe is called on the client with the publication name,
  // the client subscribes to all the data from that publication
  //   Meteor.publish('tasks', () => Tasks.find());
  // Only publish tasks that are public or belong to the current user

  Meteor.publish('tasks', function taskPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert': function (text) {
    check(text, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove': function (taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Tasks.remove(taskId);
  },
  'tasks.setChecked': function (taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    const task = Tasks.findOne(taskId);
    console.log(task.private, task.owner, Meteor.userId());
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate': function (taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
