/* globals require, describe, beforeEach, afterEach, it, window, __dirname */

var _ = require('underscore');
var expect = require('chai').expect;
var WebSocket = require('ws');
var express = require('express');
var path = require('path');
var Client = require('sockit/dist/client');

var middleware = require(path.join(__dirname, '../main/middleware.js'));

describe('The session sync client', function() {

	var client;
	var server;
	var browser;
	var listeners;

	beforeEach(function() {

		for (var port = 8000; port < 10000; port++) {
			try {
				server = new WebSocket.Server({
					port: port
				});
				break;
			} catch(error) {
				console.log(error);
			}
		}

		if (!server) {
			throw new Error('Unable to start server.');
		}

		var app = express();

		middleware({
			express: app,
			server: server,
			listeners: {
				'blah': function(event) {
					console.log('Blah changed.');
				}
			}
		});

		server.on('connection', function(socket) {
			console.log('Server received socket connection');

			server.on('message', function(message, flags) {
				console.log('Server received message: ' + message);
			});
		});

		listeners = {};

		browser = {

			location: 'http://localhost:' + port + '/',

			sessionStorage: {
				blah: 'argh',
				on: function(event, callback) {
					(listeners[event] || (listeners[event] = [])).push(callback);
				}
			}

		};

		client = new Client(browser);

		client.socket.on('open', function() {
			console.log('Client opened socket.');
		});

		client.socket.on('message', function(message, flags) {
			console.log('Client received message: ' + message);
		});

	});

	afterEach(function() {

		server && server.close();

	});

	it('should create a new session on connect', function(done) {

		console.log('?');
		done();

	});

});
