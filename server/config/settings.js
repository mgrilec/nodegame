module.exports = {

	// game settings
	game: {

		// bounds
		bounds: { x: 20000, y: 20000 },

		// ship defaults
		ship: {
			moveSpeed: 200,
			moveDrag: 100,
			turnSpeed: 5,
			turnDrag: 25,
		}
	},

	

	// update rate per second
	tickRate: 60,
	dt: 1 / 60,

	// network update rate per second
	updateRate: 30,
};