requirejs(["domReady!", "./Graph", "./Layout"], function (doc, Graph, Layout) {
	"use strict";

	var container = doc.getElementById("out"),
		vertices,
		edges,
		data,
		settings,
		graph,
		layout;

	// Trzy kostki:
	vertices = [
		{id: 0},
		{id: 1},
		{id: 2},
		{id: 3},
		{id: 4},
		{id: 5},
		{id: 6},
		{id: 7},
		{id: 8},
		{id: 9},
		{id: 10},
		{id: 11},
		{id: 12},
		{id: 13},
		{id: 14},
		{id: 15}
	];

	edges = [
		{from: 0, to: 1},
		{from: 1, to: 2},
		{from: 2, to: 3},
		{from: 3, to: 0},
		{from: 4, to: 5},
		{from: 5, to: 6},
		{from: 6, to: 7},
		{from: 7, to: 4},
		{from: 0, to: 4},
		{from: 1, to: 5},
		{from: 2, to: 6},
		{from: 3, to: 7},
		{from: 0, to: 8},
		{from: 1, to: 9},
		{from: 2, to: 10},
		{from: 3, to: 11},
		{from: 8, to: 9},
		{from: 9, to: 10},
		{from: 10, to: 11},
		{from: 11, to: 8},
		{from: 12, to: 13},
		{from: 13, to: 14},
		{from: 14, to: 15},
		{from: 15, to: 12},
		{from: 4, to: 12},
		{from: 5, to: 13},
		{from: 6, to: 14},
		{from: 7, to: 15}
	];

	data = {
		vertices: vertices,
		edges: edges
	};

	settings = {
		vertices : {
			fill : "#0093D6",
			r : 5
		},

		edges : {
			stroke : "grey"
		}
	};

	graph = new Graph(data);
	layout = new Layout(container, graph, settings);

	layout.start();
});