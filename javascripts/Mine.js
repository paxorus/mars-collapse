class Mine extends Entity{
	constructor(num) {
		super("civi0");
		this.type = "Mine";
		this.amount = num;
		this.initialAmount = num;
		this.view.addClass("mine");
		this.view.css("top", Util.pick(70, window.innerHeight - 95));
		this.view.css("left", Util.pick(70, window.innerWidth - 95));
		//this.view.click(diggedBy);
	}

	mining(deltaProgress) {
		deltaProgress = Math.min(deltaProgress, this.amount);
		//this.applyHealth(deltaProgress);
		// if(distance(this, miner) > 100) {
		// 	return;
		// }
		resources.metal += deltaProgress;
		this.amount -= deltaProgress;
		updateHud();
	}

	hasMinerals() {
		return this.amount;
	}

////////
	start() {
		this.addAmountBar(this.initialAmount);
		this.applyAmount(-5);// set health to 0
		this.view.click(recruitMiner);
		this.view.click(selectObject);
	}

	addAmountBar(health) {
		// this.initialHealth = health;
		// this.health = health;
		this.amountBar = $("<div>", {class: "health-bar"});
		this.amountBar.css({marginLeft: (this.view.width() - health) / 2 + "px", width: health});
		this.view.append(this.amountBar);
	}

	applyAmount(deltaAmount) {
		this.amount += deltaAmount;
		// change size
		this.amountBar.width(this.amount);
		// change color
		var color = Util.rybCurve(this.amount / this.initialAmount);
		this.amountBar.css("background-color", color);
		Profile.update(this, color);
	}


	// need to be fixed later, cannot use display in the profile because mine doesn't have health variable
	display() {
		var entity = this;
		var backImage = entity.view.css("background-image");
		if (backImage) {
			$("#thumbnail").css("background-image", backImage);
		}

		$("#hud-bar").width(100 * entity.amount / entity.initialAmount);

		//need to change the hud_bar 
		//$("#hud-bar").css("background-color", entity.healthBar.css("background-color"));
		$("#hud-bar").css("background-color", "black");
		$("#health-status").text(entity.amount + "/" + entity.initialAmount);
		$("#type").text(entity.type);
		$("#other").text("");
		Menu.display(entity);
	}
}