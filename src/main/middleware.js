/* globals module, require */

var _ = require('underscore');
var sockets = require('express-ws');
var Sockit = require('sockit');

/**
 *
 * @param {Object} configuration for session, etc.
 * @returns {Object} Service methods for making life easier.
 */
module.exports = function(configuration) {

	var config = _.defaults(configuration, {
		listeners: {}
	});

	// Enrich the app with express-ws
	sockets(config.express, config.server);

	// On connection, create a new sockit for the session.
	app.ws('/', function(socket, request) {
		new Sockit(socket, request.session, config.listeners);
	});

	return {

		on: function(eventKey, callback) {

			// Check to see if the listener has already been set.
			var listener = config.listeners[eventKey];
			if (listener) {
				console.log('Replacing existing event listener: ' + eventKey);
			}

			// Set the new listener and return whatever was there previously.
			config.listeners[eventKey] = callback;
			return listener;

		},

		off: function(eventKey) {

			// Check to see if the listener has been set.
			var listener = config.listeners[eventKey];
			if (!listener) {
				console.log('No event listener set for: ' + eventKey);
				return undefined;
			}

			// Remove the listener and return whatever was there.
			delete config.listeners[eventKey];
			return listener;

		}

	};

};
