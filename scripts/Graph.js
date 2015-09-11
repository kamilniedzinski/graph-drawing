define(["./Vertex"], function (Vertex) {
	"use strict";

	function Graph(data) {
		var i,
			max;

		if (!(this instanceof Graph)) {
			return new Graph(data);
		}

		this.nVerts = 0;
		this.vertices = {};
		this.adj = {}; // Adjacency list.

		for (i = 0, max = data.vertices.length; i < max; ++i) {
			this.addVertex(data.vertices[i].id, data.vertices[i].data);
		}

		for (i = 0, max = data.edges.length; i < max; ++i) {
			this.addEdge(data.edges[i].from, data.edges[i].to);
		}
	}

	Graph.prototype = {
		constructor: Graph,

		addVertex: function (id, data, posX, posY) {
			this.vertices[id] = new Vertex(id, data, posX, posY);
			++this.nVerts;
			return id;
		},

		addEdge: function (u, v) {
			this.adj[u] = this.adj[u] || [];
			this.adj[u].push(v);
			this.adj[v] = this.adj[v] || [];
			this.adj[v].push(u);
		},

		getVertex: function (id) {
			return this.vertices[id];
		},

		getSize: function () {
			return this.nVerts;
		},

		getDegree: function (v) {
			return this.adj[v].length;
		},

		forEachVertex: function (callback, this_obj) {
			var i;

			if (typeof callback === "function") {
				for (i in this.vertices) {
					if (this.vertices.hasOwnProperty(i)) {
						callback.call(this_obj, this.vertices[i], i);
					}
				}
			}
		},

		forEachEdge: function (callback, this_obj) { // Performs the "callback" function for each pair of vertices u and v such that u and v are connected by an edge.
			var j;

			if (typeof callback === "function") {
				this.forEachVertex(function (v, i) {
					j = this.adj[i].length;

					while (j--) {
						callback.call(this_obj, v, this.vertices[this.adj[i][j]]);
					}
				}, this);
			}
		}
	};

	return Graph;
});