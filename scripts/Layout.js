define(["./FRLayout", "./raphael-min"], function (FRLayout, Raphael) {
	"use strict";
	/*global window */

	function Layout(container, graph, settings) {
		if (!(this instanceof Layout)) {
			return new Layout(container, graph, settings);
		}

		this.container = container;
		this.width = container.offsetWidth;
		this.height = container.offsetHeight;
		this.settings = settings;
		this.graph = graph;
		this.layoutAlgorithm = new FRLayout({width : this.width, height : this.height}, graph);
		this.paper = new Raphael(container, this.width, this.height);
		this.vertSt = this.paper.set();
		this.edgeSt = this.paper.set();
		this.intervalId = null;
	}

	Layout.prototype = {
		constructor: Layout,

		updateGraphics: function () {
			this.vertSt.forEach(function (v) {
				v.attr("cx", this.graph.getVertex(v.id).pos.x);
				v.attr("cy", this.graph.getVertex(v.id).pos.y);
			}, this);

			this.edgeSt.forEach(function (e) {
				e.attr({path: "M" + this.graph.getVertex(e.data("u")).pos.x + "," + this.graph.getVertex(e.data("u")).pos.y + "L" + this.graph.getVertex(e.data("v")).pos.x + "," + this.graph.getVertex(e.data("v")).pos.y});
			}, this);
		},

		step: function () {
			this.layoutAlgorithm.updatePhysics();
			this.updateGraphics();
		},

		run: function () {
			var that = this;

			this.layoutAlgorithm.reset();

			if (this.intervalId === null) {
				this.intervalId = window.setInterval(function () {
					if (that.layoutAlgorithm.isDone()) {
						window.clearInterval(that.intervalId);
						that.intervalId = null;
					} else {
						that.step();
					}
				}, 30);
			}
		},

		start: function () {
			var that = this;

			this.graph.forEachEdge(function (u, v) {
				var edge = this.paper.path("M" + u.pos.x + "," + u.pos.y + "L" + v.pos.x + "," + v.pos.y);
				edge.data("u", u.id);
				edge.data("v", v.id);
				this.edgeSt.push(edge);
			}, this);

			this.graph.forEachVertex(function (v) {
				var circle = this.paper.circle(v.pos.x, v.pos.y, this.settings.vertices.r * this.graph.getDegree(v.id));
				circle.id = v.id;
				this.vertSt.push(circle);
			}, this);

			this.vertSt.drag(function (dx, dy) {
				that.graph.getVertex(this.id).pos.x = this.ox + dx;
				that.graph.getVertex(this.id).pos.y = this.oy + dy;
				that.run();
			}, function () {
				this.ox = this.attr("cx");
				this.oy = this.attr("cy");
			}, function () {
				that.run();
			});

			this.vertSt.attr("fill", this.settings.vertices.fill);
			this.vertSt.attr("opacity", this.settings.vertices.opacity || 1);
			this.vertSt.attr("stroke", "none");
			this.edgeSt.attr("stroke", this.settings.edges.stroke);

			this.run();
		}
	};

	return Layout;
});