define(function () {
	"use strict";

	function FRLayout(settings, graph) { // Fruchterman – Reingold algorithm.
		if (!(this instanceof FRLayout)) {
			return new FRLayout(settings, graph);
		}

		this.graph = graph;
		this.width = settings.width;
		this.height = settings.height;
		this.area = this.width * this.height;
		this.distConst = 0.4;
		this.iterStep = 0.1;

		this.reset();

		this.graph.forEachVertex(function (v) {
			v.pos.rand(0.0, this.width, 0.0, this.height);
		}, this);
	}

	FRLayout.MAX_ITERS = 400;

	FRLayout.prototype = {
		constructor: FRLayout,

		attraction: function (d) {
			return Math.pow(d, 2) / this.optDist;
		},

		repulsion: function (d) {
			return Math.pow(this.optDist, 2) / d;
		},

		calcAttraction: function () {
			this.graph.forEachEdge(function (u, v) {
				var delta = u.pos.sub(v.pos),
					distVec = delta.normalize().multiplyConst(this.attraction(delta.mag()));

				u.disp = u.disp.sub(distVec);
				v.dist = v.disp.sub(distVec);
			}, this);
		},

		calcRepulsion: function () {
			this.graph.forEachVertex(function (u) {
				u.disp.setValues(0.0, 0.0);

				this.graph.forEachVertex(function (v) {
					var delta;

					if (!u.equals(v)) {
						delta = u.pos.sub(v.pos);
						u.disp = u.disp.add(delta.normalize().multiplyConst(this.repulsion(delta.mag())));
					}
				}, this);
			}, this);
		},

		calcDisplacement: function () {
			this.graph.forEachVertex(function (v) {
				v.pos = v.pos.add(v.disp.normalize().multiplyConst(Math.min(v.disp.mag() / 100, this.temp * 0.1))); // ?
				v.pos.x = Math.min(this.width, Math.max(0.0, v.pos.x));
				v.pos.y = Math.min(this.height, Math.max(0.0, v.pos.y));
			}, this);
		},

		cool: function () {
			this.temp *= (1 - this.currIter / FRLayout.MAX_ITERS);
		},

		updatePhysics: function () {
			this.currIter += this.iterStep;

			this.calcRepulsion();
			this.calcAttraction();
			this.calcDisplacement();

			this.cool();
		},

		isDone: function () {
			return (this.temp < 0.5 || this.currIter > FRLayout.MAX_ITERS);
		},

		reset: function () {
			this.optDist = this.distConst * Math.sqrt(this.area / this.graph.getSize());
			this.temp = this.width / 10;
			this.currIter = 0;
		}
	};

	return FRLayout;
});