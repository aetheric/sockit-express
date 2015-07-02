/* globals module, require */

var _ = require('underscore');
var sockets = require('express-ws');
var Sockit = require('sockit');

/**
 *
 * @param {Object} configuration for session, etc.
 * @returns {Function} The middleware function for express.
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

};
