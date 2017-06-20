"use strict";

define(['ui/elements', 'flight'], function (E, flight) {

	var animationValue = geofs.aircraft.instance.animationValue;

	return {
		mainTimer: null, // = setInterval(updateLog, 120000);
		gearTimer: null, // = setInterval(checkGear, 12000);
		flapsTimer: null, // = setInterval(checkFlaps, 5000);
		speedTimer: null, // = setInterval(checkSpeed, 15000);

		/**
		 * Updates plane's flight log, set on a timer
		 *
		 * @param {String} [other] Updates the log with other as extra info
		 */
		update: function (other) {
			if (!geofs.pause && !window.flight.recorder.playing && !window.flight.recorder.paused) {
				var spd = Math.round(animationValue.ktas);
				var hdg = Math.round(animationValue.heading360);
				var alt = Math.round(animationValue.altitude);
				var fps = geofs.debug.fps;
				var lat = (Math.round(10000 * geofs.aircraft.instance.llaLocation[0])) / 10000;
				var lon = (Math.round(10000 * geofs.aircraft.instance.llaLocation[1])) / 10000;
				var date = new Date();
				var h = date.getUTCHours();
				var m = date.getUTCMinutes();
				var time = flight.formatTime(flight.timeCheck(h, m));
				other = other || "none";
				$('<tr>')
					.addClass('log-data')
					.append(
						$('<td>' + time + '</td>'),
						$('<td>' + spd + '</td>'),
						$('<td>' + hdg + '</td>'),
						$('<td>' + alt + '</td>'),
						$('<td>' + lat + '</td>'),
						$('<td>' + lon + '</td>'),
						$('<td>' + fps + '</td>'),
						$('<td>' + other + '</td>')
					).appendTo($(E.container.logTable).find('tbody'));
			}
			clearInterval(this.mainTimer);
			if (animationValue.altitude > 18000) {
				this.mainTimer = setInterval(this.update, 120000);
			} else this.mainTimer = setInterval(this.update, 30000);
		},

		/**
		 * Checks for gear retraction and extension for log, set on a timer
		 */
		gear: function () {
			if (animationValue.gearPosition !== animationValue.gearTarget) {
				if (animationValue.gearTarget === 1) this.update('Gear Up');
				else this.update('Gear Down');
			}
			clearInterval(this.gearTimer);
			if (animationValue.altitude < 10000) this.gearTimer = setInterval(this.gear, 12000);
			else this.gearTimer = setInterval(this.gear, 60000);
		},

		/**
		 * Checks for flaps target and position for log, set on a timer
		 */
		flaps: function () {
			if (animationValue.flapsPosition !== animationValue.flapsTarget) {
				this.update('Flaps set to ' + animationValue.flapsTarget);
			}
		},

		/**
		 * Checks for overspeed under 10000 feet for log, set on a timer
		 */
		speed: function () {
			var kcas = animationValue.kcas;
			var altitude = animationValue.altitude;
			if (kcas > 255 && altitude < 10000) {
				this.update('Overspeed');
			}
			clearInterval(this.speedTimer);
			if (altitude < 10000) this.speedTimer = setInterval(this.speed, 15000);
			else this.speedTimer = setInterval(this.speed, 30000);
		},

		/**
		 * Clears the log
		 */
		removeData: function () {
			$(E.container.logData).remove();
		}
	};
});
