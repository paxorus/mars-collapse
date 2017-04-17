# Mars Collapse

Mars Collapse is an online 2-player war game built with [Node.js](https://nodejs.org/en/) and Socket.IO. In the upcoming weeks, it will transition into being 3-dimensional with [Three.js](https://threejs.org/) and having collision control with [Physi.js](http://chandlerprall.github.io/Physijs/).

## How to Play
Visit the [Mars Collapse website](http://mars-collapse.herokuapp.com/) and request to play with anyone who's online. You can change your display name and search to find your friends. As soon as one of them accepts, the game will launch. You'll randomly be either the top or bottom civilization and begin with 3 robots (circular dogs for now). The goal is to destroy your opponent's base.

#### Taking Control
Click any object to view its stats at the top-right. You may direct your robots to construct buildings, mine mines, and attack enemy objects. Once they assume the role, they'll automatically stay in that role by selecting a new target every time they finish with their current target. Simply click the robot, then the target to direct the robot to interact with it.

#### Constructing Facilities
You may purchase and construct factories, turrets, and even more bases. Select a building from the top-left menu and click to place it on the map.
* Factory: select a factory to view and purchase from its submenu; be patient, a factory will only output one robot per second
* Turret: these bad-boys automatically track nearby enemies and rapid-fire homing missiles
* Base: these are expensive, but your opponent doesn't win until ALL of your bases have been destroyed

#### Collecting Resources
Direct a robot to a mine to collect more metal. You can spend this metal constructing facilities or robots.

## Interesting Bits of Code
```javascript
// Coming soon!
```

