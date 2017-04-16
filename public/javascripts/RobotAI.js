/**
 * Methods for computing a new target.
 */

var RobotAI = {

	getClosestWeakestEnemy: function (robot) {
		// identify potential targets: bases, robots, etc.
		var potentialTargets = Entities.filter(function (entity) {
			return Entities.isEnemy(robot, entity) // opposite team
		});

		if(potentialTargets.length == 0){
			return null;
		}

		if (potentialTargets.length == 1) {
			return potentialTargets[0];
		}

		var enemyCostTuples = potentialTargets.map(function (e) {
			var cost = Entities.distance(robot, e) + 36 * e.health;// distance + remaining health
			return [cost, e];
		});
		var bestEnemyCost = enemyCostTuples.reduce(function(x, y) {
			return (x[0] < y[0]) ? x : y;
		});
		return bestEnemyCost[1];
	},

	getClosestMostCompleteBuilding: function (robot) {
		var potentialTargets = Entities.filter(function (entity) {
			return entity instanceof Building
				&& !Entities.isEnemy(entity, robot) // same team
				&& !entity.isFinished();
		});

		if (potentialTargets.length == 0) {
			return null;
		}

		if (potentialTargets.length == 1) {
			return potentialTargets[0];
		}

		var buildingCostTuples = potentialTargets.map(function (b) {
			var cost = Entities.distance(robot, b) + 36 * (b.initialHealth - b.health);// distance + remaining progress
			return [cost, b];
		});

		var bestBuildingCost = buildingCostTuples.reduce(function (x, y) {
			return (x[0] < y[0]) ? x : y;
		});
		return bestBuildingCost[1];
	},

	getClosestMostPlentifulMine: function (robot) {
		var potentialTargets = Entities.filter(function (entity) {
			return entity instanceof Mine;
		});

		if (potentialTargets.length == 0) {
			return null;
		}

		if (potentialTargets.length == 1) {
			return potentialTargets[0];
		}

		var mineCostTuples = potentialTargets.map(function (m) {
			var cost = Entities.distance(robot, m) / m.health;// distance / remaining minerals
			return [cost, m];
		});
		var bestMineCost = mineCostTuples.reduce(function(x, y) {
			return (x[0] < y[0]) ? x : y;
		});
		return bestMineCost[1];
	}
};