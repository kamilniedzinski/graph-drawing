define(function () {
	"use strict";

	return {
		rand: function (min, max) {
			return Math.random() * (max - min) + min;
		}
	};
});