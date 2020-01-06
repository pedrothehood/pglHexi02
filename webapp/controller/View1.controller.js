sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("pglHexi02.pglHexi02.controller.View1", {
		onInit: function () {

		},
		onAfterRendering: function () {
			this.testpgl05();
		},
		/* ******************************************************************************************  */
		testpgl05: function () { /* ****************************************************  */

			//Create an array of files you want to load. If you don't need to load
			//any files, you can leave this out. Hexi lets you load a wide variety
			//of files: images, texture atlases, bitmap fonts, ordinary font files, and
			//sounds
			var thingsToLoad = ["images/cat.png", "fonts/puzzler.otf", "sounds/music.wav"];

			//Initialize Hexi with the `hexi` function. It has 5 arguments,
			//although only the first 3 are required:
			//a. Canvas width.
			//b. Canvas height.
			//c. The `setup` function.
			//d. The `thingsToLoad` array you defined above. This is optional.
			//e. The `load` function. This is also optional.
			//If you skip the last two arguments, Hexi will skip the loading
			//process and jump straight to the `setup` function.
			//	var g = hexi(512, 512, setup, thingsToLoad, load);
			var g = hexi(512, 512, setup);

			//Optionally Set the frames per second at which the game logic loop should run.
			//(Sprites will be rendered independently, with interpolation, at full 60 or 120 fps)
			//If you don't set the `fps`, Hexi will default to an fps of 60
			//	g.fps = 30;

			//Optionally add a border and set the background color
			//g.border = "2px red dashed";
			//g.backgroundColor = 0x000000; 13c0f9
			g.backgroundColor = 0x13c0f9; //13c0f9
			//Add the canvas that Pixi automatically created for you to the HTML document
			this.getView().byId("panel01").getDomRef().appendChild(g.canvas);

			//Optionally scale and align the canvas inside the browser window
			g.scaleToWindow();

			//Start Hexi. This is important - without this line of code, Hexi
			//won't run!
			g.start();

			/*
			2. Loading Files
			----------------
			*/

			//The `load` function will run while assets are loading. This is the
			//same `load` function you assigned as Hexi's 4th initialization argument.
			//Its optional. You can leave it out if you don't have any files to
			//load, or you don't need to monitor their loading progress

			/*			function load() {

							//Display the file currently being loaded
							console.log("loading: " + g.loadingFile);

							//Display the percentage of files currently loaded
							console.log("progress: " + g.loadingProgress);

							//Add an optional loading bar.
							g.loadingBar();

							//This built-in loading bar is fine for prototyping, but I
							//encourage to to create your own custom loading bar using Hexi's
							//`loadingFile` and `loadingProgress` values. See the `loadingBar`
							//and `makeProgressBar` methods in Hexi's `core.js` file for ideas
						}*/

			/*
			3. Initialize and Set up your game objects
			------------------------------------------
			*/

			//Declare any variables that need to be used in more than one function
			var cats = undefined,
				message = undefined;
			var drag = false;
			//var bug;
			//var heck;
			var sailboat;
			var redBuoy;
			var greenBuoy;
			var signalBuoy;
			var showTestPointsOnShip;
			var explosionMode;
			//	var messageX;
			//	var boom;
			//	var rudder;
			//	var texture;
			//	var velocity = 0;
			//	var rudder = 0;
			var G1L1, G1L2, G1R1, G1R2;
			var H1L1, H1L2, H1R1, H1R2;

			function initMainCollision() {
				if (initCollision(greenBuoy) === true || initCollision(redBuoy) === true) {
					return true;
				} else {
					return false;
				}
			}

			function initCollision(object) {
				// Red
				var s = 0.5 * sailboat.width / Math.cos(sailboat.rotation);
				G1L1.position.x = sailboat.position.x + s;
				G1L1.position.y = sailboat.position.y;
				var t = 0.5 * sailboat.width / Math.cos(0.5 * Math.PI - (sailboat.rotation * -1));
				G1L2.position.x = sailboat.position.x;
				G1L2.position.y = sailboat.position.y - t;

				// Orange --> Gegengerade 
				H1L1.position.x = sailboat.position.x - s;
				H1L1.position.y = sailboat.position.y;
				H1L2.position.x = sailboat.position.x;
				H1L2.position.y = sailboat.position.y + t;

				// Blue / Green
				//	var a = 0.5 * sailboat.height / Math.cos(sailboat.rotation);
				var a = 0.5 * sailboat.height / Math.cos(0.5 * Math.PI - (sailboat.rotation * -1));
				G1R1.position.x = sailboat.position.x + a;
				G1R1.position.y = sailboat.position.y;
				// Blue / Yellow
				//	var b = 0.5 * sailboat.height / Math.cos(0.5 * Math.PI - (sailboat.rotation * -1));
				var b = 0.5 * sailboat.height / Math.cos(sailboat.rotation * -1);
				G1R2.position.x = sailboat.position.x;
				G1R2.position.y = sailboat.position.y - b;

				// White --> Gegengerade   white/green
				H1R1.position.x = sailboat.position.x - a;
				H1R1.position.y = sailboat.position.y;
				// white/yellow
				H1R2.position.x = sailboat.position.x;
				H1R2.position.y = sailboat.position.y + b;

				// Längenvergleich: Red / orange: zu Green-Buoy:
				var area1 = areaLine(object.position.x, object.position.y, G1L1.position.x, G1L1.position.y, G1L2.position.x, G1L2.position.y);
				var area2 = areaLine(object.position.x, object.position.y, H1L1.position.x, H1L1.position.y, H1L2.position.x, H1L2.position.y);
				var areaOne = false
					//	messageX.content = "Init";
				if (area1 > 0 && area2 < 0 || area1 < 0 && area2 > 0) {

					//	 messageX.content = "OK! (Outer)";
					//	 
				} else {
					//	 	messageX.content = "Collision!";
					areaOne = true;

				}
				if (areaOne === false) {
					return false; // die beiden Bedingungen können nicht mehr true werden!	
				}
				var areaTwo = false;
				if (areaOne === true) {

					// Längenvergleich: Blue / White: ->Gerade 1: blue/yellow (G1R2) zu white/green(H1R1)  Gerade 2: blue/green(G1R1)  zu white/yellow(H1R2) 
					var area3 = areaLine(object.position.x, object.position.y, G1R2.position.x, G1R2.position.y, H1R1.position.x, H1R1.position
						.y);
					var area4 = areaLine(object.position.x, object.position.y, G1R1.position.x, G1R1.position.y, H1R2.position.x, H1R2.position
						.y);
					if (area3 > 0 && area4 < 0 || area3 < 0 && area4 > 0) {
						areaTwo = true;
						//	messageX.content = "Collision!";
						//console.log("red");
					} else {

						//	messageX.content = "OK! (Outer)";
						//console.log("green");
					}
					return areaTwo;
				}

			}
			// ist Punkt rechts/Links einer Geraden?
			function areaLine(px, py, x1, y1, x2, y2) {

				//	return (px-x1)*(y1-y2) + (py-y1)*(x2-x1);
				return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
				// 0 -> auf Linie
				// < 0 unter Linie
				// > 0 über Linie
			}

			function getVelocityVectors(velocity, angle) {
				var vx = velocity * Math.cos(angle);
				var vy = velocity * Math.sin(angle);
				var obj = {
					"vx": vx,
					"vy": vy
				};
				return obj;
			}
			//The `setup` function will run when all the assets have loaded. This
			//is the `setup` function you assigned as Hexi's 3rd argument. It's
			//mandatory - every Hexi application has to have a `setup` function
			//(although you can give it any name you want)

			//Create some keyboard objects using Hexi's `keyboard` method.
			//You would usually use this code in the `setup` function.
			//Supply the ASCII key code value as the single argument

			// 
			// Scale mode for pixelation
			//	texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

			function setup() {
				/*		var heck = g.rectangle(60, 16, "black");
						heck.anchor.set(0.5);
						var bug = g.rectangle(10, 12, "red");
						bug.anchor.set(0.5);
						sailboat = g.group();*/
				showTestPointsOnShip = false;

				explosionMode = false;
				// create our little bunny friend..
				//	texture = PIXI.Texture.fromImage('images/boat1.jpg');
				//		texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

				//	sailboat = new PIXI.Sprite(texture);
				//	var bug = g.rectangle(10, 12, "red");

				//	sailboat = g.sprite("images/boot3_100.png"); //g.sprite("images/boat1.jpg");
				if (showTestPointsOnShip === true) {
					sailboat = g.rectangle(100, 37, "grey");
				} else {
					sailboat = g.sprite(["images/boot3_100.png", "images/boot3_100_1a.png", "images/boot3_100_1b.png"]);
				}
				//	sailboat = g.sprite("images/boot3_100.png");
				//sailboat = g.rectangle(100, 37, "grey");
				// sailboat.width = 100;
				// sailboat.height = 37;
				redBuoy = g.circle(
					20,
					"0xfc0505", // rot
					"0xffe500", // gelb
					2,
					350,
					250);
				redBuoy.anchor.x = 0.5;
				redBuoy.anchor.y = 0.5;
				greenBuoy = g.circle(
					20,
					"0x00ff37", // green
					"0xffe500", // gelb
					2,
					150,
					100);
				greenBuoy.anchor.x = 0.5;
				greenBuoy.anchor.y = 0.5;
				/*let ball = g.circle(
				  diameterInPixels, 
				  "fillColor", 
				  "strokeColor", 
				  lineWidth,
				  xPosition, 
				  yPosition 
				);*/
				// boom = g.rectangle(10, 90, "red");
				// rudder = g.rectangle(5, 20, "blue");

				//sailboat.addChild(heck);
				//sailboat.addChild(bug);
				/*	signalBuoy = g.circle(
						30,
						"green",
						"green",
						0,
						50,
						250
					);*/
				/*	messageX = g.text("init");
					messageX.position.x = 100;
					messageX.position.y = 300;*/
				G1L1 = g.circle(
					10,
					"red",
					"green",
					2,
					300,
					200
				);
				G1L1.anchor.x = 0.5;
				G1L1.anchor.y = 0.5;
				G1L2 = g.circle(
					10,
					"red",
					"yellow",
					2,
					300,
					220
				);
				G1L2.anchor.x = 0.5;
				G1L2.anchor.y = 0.5;

				G1R1 = g.circle(
					10,
					"blue",
					"green",
					2,
					320,
					200
				);
				G1R1.anchor.x = 0.5;
				G1R1.anchor.y = 0.5;
				G1R2 = g.circle(
					10,
					"blue",
					"yellow",
					2,
					320,
					220
				);
				G1R2.anchor.x = 0.5;
				G1R2.anchor.y = 0.5;

				// H:
				H1L1 = g.circle(
					10,
					"orange",
					"green",
					2,
					340,
					200
				);
				H1L1.anchor.x = 0.5;
				H1L1.anchor.y = 0.5;
				H1L2 = g.circle(
					10,
					"orange",
					"yellow",
					2,
					340,
					220
				);
				H1L2.anchor.x = 0.5;
				H1L2.anchor.y = 0.5;

				H1R1 = g.circle(
					10,
					"white",
					"green",
					2,
					360,
					200
				);
				H1R1.anchor.x = 0.5;
				H1R1.anchor.y = 0.5;
				H1R2 = g.circle(
					10,
					"white",
					"yellow",
					2,
					360,
					220
				);
				H1R2.anchor.x = 0.5;
				H1R2.anchor.y = 0.5;

				if (showTestPointsOnShip === true) {
					G1L1.alpha = 1;
					G1L2.alpha = 1;
					G1R1.alpha = 1;
					G1R2.alpha = 1;
					H1L1.alpha = 1;
					H1L2.alpha = 1;
					H1R1.alpha = 1;
					H1R2.alpha = 1;
				} else {
					G1L1.alpha = 0;
					G1L2.alpha = 0;
					G1R1.alpha = 0;
					G1R2.alpha = 0;
					H1L1.alpha = 0;
					H1L2.alpha = 0;
					H1R1.alpha = 0;
					H1R2.alpha = 0;
				}

				function initBoom() {
					boom.setPosition(40, 20);
					boom.vx = 0;
					boom.vy = 0;
					boom.anchor.x = 0.5;
					boom.anchor.y = 0.5;
					boom.interactive = true;
					boom.buttonMode = true;
				}

				//sailboat.x = 10;
				//sailboat.y = 40;

				function initRudder() {
					rudder.setPosition(40, 20);
					rudder.vx = 0;
					rudder.vy = 0;
					rudder.anchor.x = 0.5;
					rudder.anchor.y = 0.5;
					//sailboat.x = 10;
					//sailboat.y = 40;

					rudder.interactive = true;
					rudder.buttonMode = true;

				}

				/*	function setYVelocityFromAngle(xVelocity,angle){ 
					
						return xVelocity * Math.tan(angle);
						
					}*/

				//sailboat = 
				//sailboat = g.rectangle(60, 16, "black");
				initSailboat();

				function initSailboat() {
					sailboat.setPosition(60, 60);
					sailboat.vx = 0;
					sailboat.vy = 0;
					sailboat.anchor.x = 0.5;
					sailboat.anchor.y = 0.5;
					sailboat.velocity = 0; // Customer
					sailboat.velocityDelta = 0.5; // Customer
					sailboat.rudder = 0; // Customer
					sailboat.rudderDelta = 0.01; // Customer: Angle-Delta
					sailboat.interactive = true;
					sailboat.buttonMode = true;

				}

				// geht nicht bei group	sailboat.anchor.set(0.5);
				//	sailboat.scale.set(3);

				//g.makeInteractive(sailboat);
				//	g.makeDraggable(sailboat);
				//	sailboat.draggable = true;
				//		sailboat.buttonMode = true;
				//	sailboat.interactive = true;

				sailboat.on("mousedown", onDragStart)
					.on("mouseup", onDragEnd)
					.on("pointerupoutside", onDragEnd)
					.on("mousemove", onDragMove);

				/*	rudder.on("mousedown", onDragStart)
									.on("mouseup", onDragEnd)
									.on("pointerupoutside", onDragEnd)
									.on("mousemove", onDragMove);
									
									
										boom.on("mousedown", onDragStart)
									.on("mouseup", onDragEnd)
									.on("pointerupoutside", onDragEnd)
									.on("mousemove", onDragMove);*/

				function onDragStart(event) {
					drag = true;
					console.log("onDragStart " + drag);
					g.state = empty;
					sailboat.data = event.data;
					sailboat.dragging = true;
					/*		boom.data = event.data;
					boom.dragging = true;
						rudder.data = event.data;
					rudder.dragging = true;
*/
				};

				function onDragEnd(event) {
					drag = false;
					console.log("onDragEnd " + drag);
					delete sailboat.data;
					/*		delete boom.data;
								delete rudder.data;*/
					sailboat.dragging = false;
					/*	boom.dragging = false;
							rudder.dragging = false;*/
					g.state = play;
				};

				function onDragMove(event) {
					console.log("onDragMove " + drag);
					if (drag === true) {
						const newPosition = sailboat.data.getLocalPosition(sailboat.parent);
						sailboat.x = newPosition.x;
						sailboat.y = newPosition.y;
						/*	boom.x = newPosition.x;
							boom.y = newPosition.y;
							rudder.x = newPosition.x;
							rudder.y = newPosition.y;*/
					}

				};
				let leftArrow = g.keyboard(37),
					upArrow = g.keyboard(38),
					rightArrow = g.keyboard(39),
					downArrow = g.keyboard(40);
				initKeyboard();

				function initKeyboard() {

					//Left arrow key `press` method
					var player;
					leftArrow.press = () => {
						sailboat.rudder -= sailboat.rudderDelta; // Customer	rudder += 0.1;

						//sailboat.rotation += 0.1;
						//sailboat.vy = setYVelocityFromAngle(sailboat.vx,sailboat.rotation);
						/*	var vectors = getVelocityVectors(sailboat.velocity,sailboat.rotation);
							sailboat.vx = vectors.vx;
							sailboat.vy = vectors.vy;*/
						/*	boom.rotation += 0.1;
								rudder.rotation += 0.1;*/
						return
						//Change the player's velocity when the key is pressed

						//player.vx = -5;
						//player.vy = 0;
					};

					//Left arrow key `release` method
					leftArrow.release = () => {
						//	sailboat.rotation = 0;
						return;
						//If the left arrow has been released, and the right arrow isn't down,
						//and the player isn't moving vertically:
						//Stop the player
						if (!rightArrow.isDown && player.vy === 0) {
							player.vx = 0;
						}
					};

					//The up arrow
					upArrow.press = () => {
						//sailboat.vx += 1;
						sailboat.velocity += sailboat.velocityDelta;

						/*	var vectors = getVelocityVectors(sailboat.velocity,sailboat.rotation);
					sailboat.vx = vectors.vx;
					sailboat.vy = vectors.vy;*/
						//	sailboat.vy = setYVelocityFromAngle(sailboat.vx,sailboat.rotation);
						//sailboat.vy += 1;
						/*	boom.vx += 1;
							boom.vy += 1;
								rudder.vx += 1;
							rudder.vy += 1;*/
						return;
						player.vy = -5;
						player.vx = 0;
					};
					upArrow.release = () => {
						return;
						if (!downArrow.isDown && player.vx === 0) {
							player.vy = 0;
						}
					};

					//The right arrow
					rightArrow.press = () => {
						//	sailboat.rotation -= 0.1;
						sailboat.rudder += sailboat.rudderDelta;
						/*	var vectors = getVelocityVectors(sailboat.velocity,sailboat.rotation);
					sailboat.vx = vectors.vx;
					sailboat.vy = vectors.vy;*/
						//	sailboat.vy = setYVelocityFromAngle(sailboat.vx,sailboat.rotation);
						/*		boom.rotation -= 0.1;
									rudder.rotation -= 0.1;*/
						return;
						player.vx = 5;
						player.vy = 0;
					};
					rightArrow.release = () => {
						//	sailboat.rotation = 0;
						return;
						if (!leftArrow.isDown && player.vy === 0) {
							player.vx = 0;
						}
					};

					//The down arrow
					downArrow.press = () => {
						//sailboat.vx += -1;
						sailboat.velocity -= sailboat.velocityDelta;
						/*			var vectors = getVelocityVectors(sailboat.velocity,sailboat.rotation);
							sailboat.vx = vectors.vx;
							sailboat.vy = vectors.vy;*/
						//	sailboat.vy = setYVelocityFromAngle(sailboat.vx,sailboat.rotation);
						//sailboat.vy += -1;
						/*	boom.vx += -1;
							boom.vy += -1;
							rudder.vx += -1;
							rudder.vy += -1;*/
						return;
						player.vy = 5;
						player.vx = 0;
					};
					downArrow.release = () => {
						return;
						if (!upArrow.isDown && player.vx === 0) {
							player.vy = 0;
						}
					};

				}
				/*			sailboat.on("pointerdown", onDragStart)
								.on("pointerup", onDragEnd)
								.on("pointerupoutside", onDragEnd)
								.on("pointermove", onDragMove);
							sailboat.press = () => {
								console.log("Pressed");
							}*/
				/*	sailboat.release = () => {
							console.log("Released");
						}*/
				/*	sailboat.on("mousedown", function (e) {
						drag = sailboat;
					})
					sailboat.on("mouseup", function (e) {
						drag = false;
					})
					sailboat.on("mousemove", function (e) {
							if (drag) {
								drag.position.x += e.data.originalEvent.movementX;
								drag.position.y += e.data.originalEvent.movementY;
							}
						})*/
				// enable the bunny to be interactive... this will allow it to respond to mouse and touch events

				//Create a `group` called `cats` to store all the cats
				//	cats = g.group();

				//Create a function to make a cat sprite. `makeCat` takes two arguments:
				//the `x` and `y` screen position values where the cat should start.
				//As you'll see ahead, this function is going to be called by Hexi's
				//`pointer` object each time it's clicked.
				//	var makeCat = function makeCat(x, y) {

				//Create the cat sprite. Supply the `sprite` method with
				//the name of the loaded image that should be displayed
				//		var cat = g.sprite("images/cat.png");

				//Hexi exposes Pixi (the 2D rendering engine) as a top level global object called `PIXI`. That
				//means you can use the `PIXI` object to write any low-level Pixi code,
				//directly in your Hexi application. All of Hexi's sprites are just
				//ordinary Pixi sprites under the hood, so any Pixi code you write to modify
				//them will work

				//Set the cat's position
				//		cat.setPosition(x, y);

				//You can alternatively set the position my modifying the sprite's `x` and
				//`y` properties directly, like this
				//cat.x = x;
				//cat.y = y;

				//Add some optional tween animation effects from the Hexi's
				//built-in tween library (called Charm). `breathe` makes the
				//sprite scale in and out. `pulse` oscillates its transparency
				//		g.breathe(cat, 2, 2, 20);
				//		g.pulse(cat, 10, 0.5);

				//Set the cat's velocity to a random number between -10 and 10
				//		cat.vx = g.randomInt(-10, 10);
				//		cat.vy = g.randomInt(-10, 10);

				//Add the cat to the `cats` group
				//		cats.addChild(cat);
				//	};

				//Create a text sprite. Display the initial text, set the font
				//style and colour
				////	message = g.text("Tap for cats!", "38px puzzler", "red");

				//You can re-assign the text sprite's style at any time by assigning
				//a custom options object to the `style` property. See Pixi's
				//documentation on the `Text` class for the complete list of options
				//you can set
				//message.style = {fill: "black", font: "16px Helvetica"};

				//You can also create bitmap text with the `bitmapText` method
				//Make sure to load the bitmap text's XML file first.
				//message = g.bitmapText("Tap to make cats!", "32p disko");

				//Center the `message` sprite relative to the `stage`
				////	g.stage.putCenter(message);

				//You can also use
				//`putLeft`, `putRight`, `putTop` or `putBottom` methods to help you
				//align objects relative to other objects. The optional 2nd and 3rd
				//arguments of these methods define the x and y offset, which help
				//you fine-tune positioning.

				//Center the message text's rotation point
				//around its center by setting its `pivotX` and `pivotY` properties.
				//(These are normalized, 0 to 1 values - 0.5 means dead center)
				////		message.pivotX = 0.5;
				////			message.pivotY = 0.5;

				//You can also use this alternative syntax to set the pivot point:
				//message.setPivot(0.5, 0.5);

				//Hexi has a built-in universal pointer object that works for both
				//touch and the mouse.
				//Create a cat sprite when you `tap` Hexi's `pointer`.
				//(The pointer also has `press` and `release` methods)
				////		g.pointer.tap = function () {

				//Supply `makeCat` with the pointer's `x` and `y` coordinates.
				////			makeCat(g.pointer.x, g.pointer.y);

				//Make the `message.content` display the number of cats
				////			message.content = "" + cats.children.length;
				//		};

				//Play an optional loaded sound file.
				/*		var music = g.sound("sounds/music.wav");
						music.loop = true;
						music.play();*/

				//Set the game state to play. This is very important! Whatever
				//function you assign to Hexi's `state` property will be run by
				//Hexi in a loop.
				g.state = play;
			} // Setup End

			/*
			4. The game logic
			------------------
			*/
			function empty() {

			}
			//The `play` function is called in a continuous loop, at whatever fps
			//(frames per second) value you set. This is your *game logic loop*. (The
			//render loop will be run by Hexi in the background at the maximum fps
			//your system can handle.) You can pause Hexi's game loop at any time
			//with the `pause` method, and restart it with the `resume` method

			function play() {
				var boatHit = false;

				if (drag === true) return;
				//initMainCollision();
				//greenBuoy.circular = true;
				//redBuoy.circular = true;
				//bump:add(<object>, <whatever>, <whatever>, <image>:getWidth(), <image>:getHeight())
				//boatHit = g.hitTestCircleRectangle(greenBuoy,sailboat);   // /rectangleCollision
				boatHit = g.hitTestCircleRectangle(greenBuoy, sailboat);
				//	boatHit = g.circleRectangleCollision(greenBuoy,sailboat);

				if (initMainCollision() === true) { // mit eigener Routine

					//	if (boatHit !== undefined && boatHit !== false) {
					//console.log(g.hit(sailboat,[greenBuoy,redBuoy]));
					//boatHitsGreen = true;
					if (explosionMode === false) {
						explosionMode === true;
						//	g.wait(1000, () => {g.show(1)});
						g.wait(100, () => {sailboat.show(1)});
						g.wait(400, () => {sailboat.show(2)});
			//				g.wait(100, () => {sailboat.show(1)});
			//			g.wait(400, () => {sailboat.show(2)});
					//	sailboat.show(1)
					} else {
					//	sailboat.show(2);

					}
					sailboat.alpha = 0.5;
					//console.log(boatHit);
				} else {
					sailboat.show(0); // Standard-Bild
					sailboat.alpha = 1;
				}

				//	let collision = g.contain(sailboat, g.stage, true);
				//	let collision2 = g.contain(boom, g.stage, true);
				if (sailboat.velocity !== 0) { // steuerbar nur, falls fährt
					sailboat.rotation += sailboat.rudder;
				}

				var vectors = getVelocityVectors(sailboat.velocity, sailboat.rotation);
				sailboat.vx = vectors.vx;
				sailboat.vy = vectors.vy;

				sailboat.x += sailboat.vx;
				sailboat.y += sailboat.vy;

				//	g.hit(sailboat, redBuoy,true,true);
				//		g.hit(sailboat, greenBuoy,true,true);
				/*	boom.x += boom.vx;
					boom.y += boom.vy;
					rudder.x += rudder.vx;
					rudder.y += rudder.vy;*/

				//console.log(g.soundObjects["sounds/music.wav"].buffer);

				//Optionally, here's how you can make cats continuously if the pointer `isDown`
				//inside the game loop:
				/*
				if (g.pointer.isDown) {
				  makeCat(g.pointer.x, g.pointer.y);
				  message.content = `${cats.children.length} cats!`;
				}
				*/

				//Rotate the text
				//		message.rotation += 0.1;

				/*				//Loop through all of the cats to make them move and bounce off the
								//edges of the stage
					 		cats.children.forEach(function (cat) {

									//Check for a collision between the cat and the stage boundaries
									//using Hexi's `contain` method. Setting `true` as the third
									//argument will make the cat bounce when it hits the stage
									//boundaries
									var collision = g.contain(cat, g.stage, true);

									//If there's no collision, the `collision` variable will be
									//`undefined`. But if there is a collision, it will have any of
									//the string values "left", "right", "top", or "bottom", depending
									//on which side of the stage the cat hit

									//Move the cat with the `move` method. The `move` method updates
									//the sprite's position by its `vx` and `vy` velocity values. (All Hexi
									//sprites have `vx` and `vy` properties, which are initialized to
									//zero). You can move more than one sprite at a time by supplying
									//`move` with a list of sprites, separated by commas.
									g.move(cat);

									//Here's what `move` is actually doing under the hood:
									//cat.x += cat.vx;
									//cat.y += cat.vy;
								});*/
			}

			/*
			With this basic Hexi architecture, you can create anything. Just set
			Hexi's `state` property to any other function to switch the
			behaviour of your application. Here's how:

			   g.state = anyStateFunction;

			Write as many state functions as you need.
			If it's a small project, you can keep all these functions in one file. But,
			for a big project, load your functions from
			external JS files as you need them. Use any module system you
			prefer, like ES6 modules, CommonJS, AMD, or good old HTML `<script>` tags.
			This simple architectural model can scale to any size, and is the only
			architectural model you need to know. Keep it simple and stay happy!
			*/
			//# sourceMappingURL=quickStart.js.map

		},
		/* ******************************************************************************************  */
		testpgl04: function () {

			/*	const app = new PIXI.Application({
					backgroundColor: 0x1099bb
				});*/

			var g = hexi(512, 512, setup);
			//		document.body.appendChild(app.view);
			//	this.getView().byId("panel01").getDomRef().appendChild(g.canvas);
			// create a texture from an image path
			this.getView().byId("panel01").getDomRef().appendChild(g.canvas);

			//	const texture = PIXI.Texture.from('images/bunny.png');
			const texture = PIXI.Texture.fromImage('images/bunny.png');
			g.scaleToWindow();

			//Start Hexi. This is important - without this line of code, Hexi
			//won't run!
			g.start();

			function setup() {

				// Scale mode for pixelation
				texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

				for (let i = 0; i < 10; i++) {
					createBunny(
						Math.floor(Math.random() * screen.width), //app.screen.width),
						Math.floor(Math.random() * screen.height) //app.screen.height),
					);
				}

				function createBunny(x, y) {
					// create our little bunny friend..
					const bunny = new PIXI.Sprite(texture);

					// enable the bunny to be interactive... this will allow it to respond to mouse and touch events
					bunny.interactive = true;

					// this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
					bunny.buttonMode = true;

					// center the bunny's anchor point
					bunny.anchor.set(0.5);

					// make it a bit bigger, so it's easier to grab
					bunny.scale.set(3);

					// setup events for mouse + touch using
					// the pointer events
					bunny
						.on('pointerdown', onDragStart)
						.on('pointerup', onDragEnd)
						.on('pointerupoutside', onDragEnd)
						.on('pointermove', onDragMove);

					// For mouse-only events
					// .on('mousedown', onDragStart)
					// .on('mouseup', onDragEnd)
					// .on('mouseupoutside', onDragEnd)
					// .on('mousemove', onDragMove);

					// For touch-only events
					// .on('touchstart', onDragStart)
					// .on('touchend', onDragEnd)
					// .on('touchendoutside', onDragEnd)
					// .on('touchmove', onDragMove);

					// move the sprite to its designated position
					bunny.x = x;
					bunny.y = y;

					// add it to the stage
					var gg = g;
					g.stage.addChild(bunny)
						//app.stage.addChild(bunny);
				}
			}

			function onDragStart(event) {
				// store a reference to the data
				// the reason for this is because of multitouch
				// we want to track the movement of this particular touch
				this.data = event.data;
				this.alpha = 0.5;
				this.dragging = true;
			}

			function onDragEnd() {
				this.alpha = 1;
				this.dragging = false;
				// set the interaction data to null
				this.data = null;
			}

			function onDragMove() {
				if (this.dragging) {
					const newPosition = this.data.getLocalPosition(this.parent);
					this.x = newPosition.x;
					this.y = newPosition.y;
				}
			}

		},

		testpgl03: function () {

			var config = {
				type: Phaser.AUTO,
				width: 800,
				height: 600,
				backgroundColor: '#2d2d2d',
				parent: 'phaser-example',
				scene: {
					preload: preload,
					create: create
				}
			};

			var game = new Phaser.Game(config);

			function preload() {
				//this.load.image('orb', 'assets/sprites/orb-blue.png');
			}

			function create() {
				//  Create 300 sprites (they all start life at 0x0)
				var group = this.add.group({
					key: 'orb',
					frameQuantity: 300
				});

				var triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 100, 380);
				// var triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);

				//  Randomly position the sprites within the triangle
				Phaser.Actions.RandomTriangle(group.getChildren(), triangle);
			}

		},

		testpgl02: function () { /* ****************************************************  */

			//Create an array of files you want to load. If you don't need to load
			//any files, you can leave this out. Hexi lets you load a wide variety
			//of files: images, texture atlases, bitmap fonts, ordinary font files, and
			//sounds
			var thingsToLoad = ["images/cat.png", "fonts/puzzler.otf", "sounds/music.wav"];

			//Initialize Hexi with the `hexi` function. It has 5 arguments,
			//although only the first 3 are required:
			//a. Canvas width.
			//b. Canvas height.
			//c. The `setup` function.
			//d. The `thingsToLoad` array you defined above. This is optional.
			//e. The `load` function. This is also optional.
			//If you skip the last two arguments, Hexi will skip the loading
			//process and jump straight to the `setup` function.
			//	var g = hexi(512, 512, setup, thingsToLoad, load);
			var g = hexi(512, 512, setup);

			//Optionally Set the frames per second at which the game logic loop should run.
			//(Sprites will be rendered independently, with interpolation, at full 60 or 120 fps)
			//If you don't set the `fps`, Hexi will default to an fps of 60
			//	g.fps = 30;

			//Optionally add a border and set the background color
			//g.border = "2px red dashed";
			//g.backgroundColor = 0x000000;

			//Add the canvas that Pixi automatically created for you to the HTML document
			this.getView().byId("panel01").getDomRef().appendChild(g.canvas);

			//Optionally scale and align the canvas inside the browser window
			g.scaleToWindow();

			//Start Hexi. This is important - without this line of code, Hexi
			//won't run!
			g.start();

			/*
			2. Loading Files
			----------------
			*/

			//The `load` function will run while assets are loading. This is the
			//same `load` function you assigned as Hexi's 4th initialization argument.
			//Its optional. You can leave it out if you don't have any files to
			//load, or you don't need to monitor their loading progress

			/*			function load() {

							//Display the file currently being loaded
							console.log("loading: " + g.loadingFile);

							//Display the percentage of files currently loaded
							console.log("progress: " + g.loadingProgress);

							//Add an optional loading bar.
							g.loadingBar();

							//This built-in loading bar is fine for prototyping, but I
							//encourage to to create your own custom loading bar using Hexi's
							//`loadingFile` and `loadingProgress` values. See the `loadingBar`
							//and `makeProgressBar` methods in Hexi's `core.js` file for ideas
						}*/

			/*
			3. Initialize and Set up your game objects
			------------------------------------------
			*/

			//Declare any variables that need to be used in more than one function
			var cats = undefined,
				message = undefined;
			var drag = false;
			var bug;
			var heck;
			var sailboat;
			var boom;
			var rudder;
			var texture;
			//The `setup` function will run when all the assets have loaded. This
			//is the `setup` function you assigned as Hexi's 3rd argument. It's
			//mandatory - every Hexi application has to have a `setup` function
			//(although you can give it any name you want)

			//Create some keyboard objects using Hexi's `keyboard` method.
			//You would usually use this code in the `setup` function.
			//Supply the ASCII key code value as the single argument

			// 
			// Scale mode for pixelation
			//	texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

			function setup() {
				/*		var heck = g.rectangle(60, 16, "black");
						heck.anchor.set(0.5);
						var bug = g.rectangle(10, 12, "red");
						bug.anchor.set(0.5);
						sailboat = g.group();*/

				// create our little bunny friend..
				//	texture = PIXI.Texture.fromImage('images/boat1.jpg');
				//		texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

				//	sailboat = new PIXI.Sprite(texture);
				//	var bug = g.rectangle(10, 12, "red");

				sailboat = g.sprite("images/boat1.jpg");
				boom = g.rectangle(10, 90, "red");
				rudder = g.rectangle(5, 20, "blue");

				//sailboat.addChild(heck);
				//sailboat.addChild(bug);

				boom.setPosition(40, 20);
				boom.vx = 0;
				boom.vy = 0;
				boom.anchor.x = 0.5;
				boom.anchor.y = 0.5;
				//sailboat.x = 10;
				//sailboat.y = 40;

				boom.interactive = true;
				boom.buttonMode = true;

				rudder.setPosition(40, 20);
				rudder.vx = 0;
				rudder.vy = 0;
				rudder.anchor.x = 0.5;
				rudder.anchor.y = 0.5;
				//sailboat.x = 10;
				//sailboat.y = 40;

				rudder.interactive = true;
				rudder.buttonMode = true;

				//sailboat = 
				//sailboat = g.rectangle(60, 16, "black");
				sailboat.setPosition(40, 20);
				sailboat.vx = 0;
				sailboat.vy = 0;
				sailboat.anchor.x = 0.5;
				sailboat.anchor.y = 0.5;
				//sailboat.x = 10;
				//sailboat.y = 40;

				sailboat.interactive = true;
				sailboat.buttonMode = true;
				// geht nicht bei group	sailboat.anchor.set(0.5);
				//	sailboat.scale.set(3);

				//g.makeInteractive(sailboat);
				//	g.makeDraggable(sailboat);
				//	sailboat.draggable = true;
				//		sailboat.buttonMode = true;
				//	sailboat.interactive = true;

				sailboat.on("mousedown", onDragStart)
					.on("mouseup", onDragEnd)
					.on("pointerupoutside", onDragEnd)
					.on("mousemove", onDragMove);

				rudder.on("mousedown", onDragStart)
					.on("mouseup", onDragEnd)
					.on("pointerupoutside", onDragEnd)
					.on("mousemove", onDragMove);

				boom.on("mousedown", onDragStart)
					.on("mouseup", onDragEnd)
					.on("pointerupoutside", onDragEnd)
					.on("mousemove", onDragMove);

				function onDragStart(event) {
					drag = true;
					console.log("onDragStart " + drag);
					g.state = empty;
					sailboat.data = event.data;
					sailboat.dragging = true;
					boom.data = event.data;
					boom.dragging = true;
					rudder.data = event.data;
					rudder.dragging = true;

				};

				function onDragEnd(event) {
					drag = false;
					console.log("onDragEnd " + drag);
					delete sailboat.data;
					delete boom.data;
					delete rudder.data;
					sailboat.dragging = false;
					boom.dragging = false;
					rudder.dragging = false;
					g.state = play;
				};

				function onDragMove(event) {
					console.log("onDragMove " + drag);
					if (drag === true) {
						const newPosition = sailboat.data.getLocalPosition(sailboat.parent);
						sailboat.x = newPosition.x;
						sailboat.y = newPosition.y;
						boom.x = newPosition.x;
						boom.y = newPosition.y;
						rudder.x = newPosition.x;
						rudder.y = newPosition.y;
					}

				};
				let leftArrow = g.keyboard(37),
					upArrow = g.keyboard(38),
					rightArrow = g.keyboard(39),
					downArrow = g.keyboard(40);
				initKeyboard();

				function initKeyboard() {

					//Left arrow key `press` method
					var player;
					leftArrow.press = () => {
						sailboat.rotation += 0.1;
						boom.rotation += 0.1;
						rudder.rotation += 0.1;
						return
						//Change the player's velocity when the key is pressed

						//player.vx = -5;
						//player.vy = 0;
					};

					//Left arrow key `release` method
					leftArrow.release = () => {
						//	sailboat.rotation = 0;
						return;
						//If the left arrow has been released, and the right arrow isn't down,
						//and the player isn't moving vertically:
						//Stop the player
						if (!rightArrow.isDown && player.vy === 0) {
							player.vx = 0;
						}
					};

					//The up arrow
					upArrow.press = () => {
						sailboat.vx += 1;
						sailboat.vy += 1;
						boom.vx += 1;
						boom.vy += 1;
						rudder.vx += 1;
						rudder.vy += 1;
						return;
						player.vy = -5;
						player.vx = 0;
					};
					upArrow.release = () => {
						return;
						if (!downArrow.isDown && player.vx === 0) {
							player.vy = 0;
						}
					};

					//The right arrow
					rightArrow.press = () => {
						sailboat.rotation -= 0.1;
						boom.rotation -= 0.1;
						rudder.rotation -= 0.1;
						return;
						player.vx = 5;
						player.vy = 0;
					};
					rightArrow.release = () => {
						//	sailboat.rotation = 0;
						return;
						if (!leftArrow.isDown && player.vy === 0) {
							player.vx = 0;
						}
					};

					//The down arrow
					downArrow.press = () => {
						sailboat.vx += -1;
						sailboat.vy += -1;
						boom.vx += -1;
						boom.vy += -1;
						rudder.vx += -1;
						rudder.vy += -1;
						return;
						player.vy = 5;
						player.vx = 0;
					};
					downArrow.release = () => {
						return;
						if (!upArrow.isDown && player.vx === 0) {
							player.vy = 0;
						}
					};

				}
				/*			sailboat.on("pointerdown", onDragStart)
								.on("pointerup", onDragEnd)
								.on("pointerupoutside", onDragEnd)
								.on("pointermove", onDragMove);
							sailboat.press = () => {
								console.log("Pressed");
							}*/
				/*	sailboat.release = () => {
							console.log("Released");
						}*/
				/*	sailboat.on("mousedown", function (e) {
						drag = sailboat;
					})
					sailboat.on("mouseup", function (e) {
						drag = false;
					})
					sailboat.on("mousemove", function (e) {
							if (drag) {
								drag.position.x += e.data.originalEvent.movementX;
								drag.position.y += e.data.originalEvent.movementY;
							}
						})*/
				// enable the bunny to be interactive... this will allow it to respond to mouse and touch events

				//Create a `group` called `cats` to store all the cats
				//	cats = g.group();

				//Create a function to make a cat sprite. `makeCat` takes two arguments:
				//the `x` and `y` screen position values where the cat should start.
				//As you'll see ahead, this function is going to be called by Hexi's
				//`pointer` object each time it's clicked.
				//	var makeCat = function makeCat(x, y) {

				//Create the cat sprite. Supply the `sprite` method with
				//the name of the loaded image that should be displayed
				//		var cat = g.sprite("images/cat.png");

				//Hexi exposes Pixi (the 2D rendering engine) as a top level global object called `PIXI`. That
				//means you can use the `PIXI` object to write any low-level Pixi code,
				//directly in your Hexi application. All of Hexi's sprites are just
				//ordinary Pixi sprites under the hood, so any Pixi code you write to modify
				//them will work

				//Set the cat's position
				//		cat.setPosition(x, y);

				//You can alternatively set the position my modifying the sprite's `x` and
				//`y` properties directly, like this
				//cat.x = x;
				//cat.y = y;

				//Add some optional tween animation effects from the Hexi's
				//built-in tween library (called Charm). `breathe` makes the
				//sprite scale in and out. `pulse` oscillates its transparency
				//		g.breathe(cat, 2, 2, 20);
				//		g.pulse(cat, 10, 0.5);

				//Set the cat's velocity to a random number between -10 and 10
				//		cat.vx = g.randomInt(-10, 10);
				//		cat.vy = g.randomInt(-10, 10);

				//Add the cat to the `cats` group
				//		cats.addChild(cat);
				//	};

				//Create a text sprite. Display the initial text, set the font
				//style and colour
				////	message = g.text("Tap for cats!", "38px puzzler", "red");

				//You can re-assign the text sprite's style at any time by assigning
				//a custom options object to the `style` property. See Pixi's
				//documentation on the `Text` class for the complete list of options
				//you can set
				//message.style = {fill: "black", font: "16px Helvetica"};

				//You can also create bitmap text with the `bitmapText` method
				//Make sure to load the bitmap text's XML file first.
				//message = g.bitmapText("Tap to make cats!", "32p disko");

				//Center the `message` sprite relative to the `stage`
				////	g.stage.putCenter(message);

				//You can also use
				//`putLeft`, `putRight`, `putTop` or `putBottom` methods to help you
				//align objects relative to other objects. The optional 2nd and 3rd
				//arguments of these methods define the x and y offset, which help
				//you fine-tune positioning.

				//Center the message text's rotation point
				//around its center by setting its `pivotX` and `pivotY` properties.
				//(These are normalized, 0 to 1 values - 0.5 means dead center)
				////		message.pivotX = 0.5;
				////			message.pivotY = 0.5;

				//You can also use this alternative syntax to set the pivot point:
				//message.setPivot(0.5, 0.5);

				//Hexi has a built-in universal pointer object that works for both
				//touch and the mouse.
				//Create a cat sprite when you `tap` Hexi's `pointer`.
				//(The pointer also has `press` and `release` methods)
				////		g.pointer.tap = function () {

				//Supply `makeCat` with the pointer's `x` and `y` coordinates.
				////			makeCat(g.pointer.x, g.pointer.y);

				//Make the `message.content` display the number of cats
				////			message.content = "" + cats.children.length;
				//		};

				//Play an optional loaded sound file.
				/*		var music = g.sound("sounds/music.wav");
						music.loop = true;
						music.play();*/

				//Set the game state to play. This is very important! Whatever
				//function you assign to Hexi's `state` property will be run by
				//Hexi in a loop.
				g.state = play;
			} // Setup End

			/*
			4. The game logic
			------------------
			*/
			function empty() {

			}
			//The `play` function is called in a continuous loop, at whatever fps
			//(frames per second) value you set. This is your *game logic loop*. (The
			//render loop will be run by Hexi in the background at the maximum fps
			//your system can handle.) You can pause Hexi's game loop at any time
			//with the `pause` method, and restart it with the `resume` method

			function play() {
				if (drag === true) return;
				//	let collision = g.contain(sailboat, g.stage, true);
				//	let collision2 = g.contain(boom, g.stage, true);
				sailboat.x += sailboat.vx;
				sailboat.y += sailboat.vy;
				boom.x += boom.vx;
				boom.y += boom.vy;
				rudder.x += rudder.vx;
				rudder.y += rudder.vy;

				//console.log(g.soundObjects["sounds/music.wav"].buffer);

				//Optionally, here's how you can make cats continuously if the pointer `isDown`
				//inside the game loop:
				/*
				if (g.pointer.isDown) {
				  makeCat(g.pointer.x, g.pointer.y);
				  message.content = `${cats.children.length} cats!`;
				}
				*/

				//Rotate the text
				//		message.rotation += 0.1;

				/*				//Loop through all of the cats to make them move and bounce off the
								//edges of the stage
					 		cats.children.forEach(function (cat) {

									//Check for a collision between the cat and the stage boundaries
									//using Hexi's `contain` method. Setting `true` as the third
									//argument will make the cat bounce when it hits the stage
									//boundaries
									var collision = g.contain(cat, g.stage, true);

									//If there's no collision, the `collision` variable will be
									//`undefined`. But if there is a collision, it will have any of
									//the string values "left", "right", "top", or "bottom", depending
									//on which side of the stage the cat hit

									//Move the cat with the `move` method. The `move` method updates
									//the sprite's position by its `vx` and `vy` velocity values. (All Hexi
									//sprites have `vx` and `vy` properties, which are initialized to
									//zero). You can move more than one sprite at a time by supplying
									//`move` with a list of sprites, separated by commas.
									g.move(cat);

									//Here's what `move` is actually doing under the hood:
									//cat.x += cat.vx;
									//cat.y += cat.vy;
								});*/
			}

			/*
			With this basic Hexi architecture, you can create anything. Just set
			Hexi's `state` property to any other function to switch the
			behaviour of your application. Here's how:

			   g.state = anyStateFunction;

			Write as many state functions as you need.
			If it's a small project, you can keep all these functions in one file. But,
			for a big project, load your functions from
			external JS files as you need them. Use any module system you
			prefer, like ES6 modules, CommonJS, AMD, or good old HTML `<script>` tags.
			This simple architectural model can scale to any size, and is the only
			architectural model you need to know. Keep it simple and stay happy!
			*/
			//# sourceMappingURL=quickStart.js.map

		},
		testpgl01: function () {

			//Create an array of files you want to load. If you don't need to load
			//any files, you can leave this out. Hexi lets you load a wide variety
			//of files: images, texture atlases, bitmap fonts, ordinary font files, and
			//sounds
			var thingsToLoad = ["images/cat.png", "fonts/puzzler.otf", "sounds/music.wav"];

			//Initialize Hexi with the `hexi` function. It has 5 arguments,
			//although only the first 3 are required:
			//a. Canvas width.
			//b. Canvas height.
			//c. The `setup` function.
			//d. The `thingsToLoad` array you defined above. This is optional.
			//e. The `load` function. This is also optional.
			//If you skip the last two arguments, Hexi will skip the loading
			//process and jump straight to the `setup` function.
			var g = hexi(512, 512, setup, thingsToLoad, load);

			//Optionally Set the frames per second at which the game logic loop should run.
			//(Sprites will be rendered independently, with interpolation, at full 60 or 120 fps)
			//If you don't set the `fps`, Hexi will default to an fps of 60
			g.fps = 30;

			//Optionally add a border and set the background color
			//g.border = "2px red dashed";
			//g.backgroundColor = 0x000000;

			//Add the canvas that Pixi automatically created for you to the HTML document
			this.getView().byId("panel01").getDomRef().appendChild(g.canvas);

			//Optionally scale and align the canvas inside the browser window
			g.scaleToWindow();

			//Start Hexi. This is important - without this line of code, Hexi
			//won't run!
			g.start();

			/*
			2. Loading Files
			----------------
			*/

			//The `load` function will run while assets are loading. This is the
			//same `load` function you assigned as Hexi's 4th initialization argument.
			//Its optional. You can leave it out if you don't have any files to
			//load, or you don't need to monitor their loading progress

			function load() {

				//Display the file currently being loaded
				console.log("loading: " + g.loadingFile);

				//Display the percentage of files currently loaded
				console.log("progress: " + g.loadingProgress);

				//Add an optional loading bar.
				g.loadingBar();

				//This built-in loading bar is fine for prototyping, but I
				//encourage to to create your own custom loading bar using Hexi's
				//`loadingFile` and `loadingProgress` values. See the `loadingBar`
				//and `makeProgressBar` methods in Hexi's `core.js` file for ideas
			}

			/*
			3. Initialize and Set up your game objects
			------------------------------------------
			*/

			//Declare any variables that need to be used in more than one function
			var cats = undefined,
				message = undefined;

			//The `setup` function will run when all the assets have loaded. This
			//is the `setup` function you assigned as Hexi's 3rd argument. It's
			//mandatory - every Hexi application has to have a `setup` function
			//(although you can give it any name you want)

			function setup() {

				//Create a `group` called `cats` to store all the cats
				cats = g.group();

				//Create a function to make a cat sprite. `makeCat` takes two arguments:
				//the `x` and `y` screen position values where the cat should start.
				//As you'll see ahead, this function is going to be called by Hexi's
				//`pointer` object each time it's clicked.
				var makeCat = function makeCat(x, y) {

					//Create the cat sprite. Supply the `sprite` method with
					//the name of the loaded image that should be displayed
					var cat = g.sprite("images/cat.png");

					//Hexi exposes Pixi (the 2D rendering engine) as a top level global object called `PIXI`. That
					//means you can use the `PIXI` object to write any low-level Pixi code,
					//directly in your Hexi application. All of Hexi's sprites are just
					//ordinary Pixi sprites under the hood, so any Pixi code you write to modify
					//them will work

					//Set the cat's position
					cat.setPosition(x, y);

					//You can alternatively set the position my modifying the sprite's `x` and
					//`y` properties directly, like this
					//cat.x = x;
					//cat.y = y;

					//Add some optional tween animation effects from the Hexi's
					//built-in tween library (called Charm). `breathe` makes the
					//sprite scale in and out. `pulse` oscillates its transparency
					g.breathe(cat, 2, 2, 20);
					g.pulse(cat, 10, 0.5);

					//Set the cat's velocity to a random number between -10 and 10
					cat.vx = g.randomInt(-10, 10);
					cat.vy = g.randomInt(-10, 10);

					//Add the cat to the `cats` group
					cats.addChild(cat);
				};

				//Create a text sprite. Display the initial text, set the font
				//style and colour
				message = g.text("Tap for cats!", "38px puzzler", "red");

				//You can re-assign the text sprite's style at any time by assigning
				//a custom options object to the `style` property. See Pixi's
				//documentation on the `Text` class for the complete list of options
				//you can set
				//message.style = {fill: "black", font: "16px Helvetica"};

				//You can also create bitmap text with the `bitmapText` method
				//Make sure to load the bitmap text's XML file first.
				//message = g.bitmapText("Tap to make cats!", "32p disko");

				//Center the `message` sprite relative to the `stage`
				g.stage.putCenter(message);

				//You can also use
				//`putLeft`, `putRight`, `putTop` or `putBottom` methods to help you
				//align objects relative to other objects. The optional 2nd and 3rd
				//arguments of these methods define the x and y offset, which help
				//you fine-tune positioning.

				//Center the message text's rotation point
				//around its center by setting its `pivotX` and `pivotY` properties.
				//(These are normalized, 0 to 1 values - 0.5 means dead center)
				message.pivotX = 0.5;
				message.pivotY = 0.5;

				//You can also use this alternative syntax to set the pivot point:
				//message.setPivot(0.5, 0.5);

				//Hexi has a built-in universal pointer object that works for both
				//touch and the mouse.
				//Create a cat sprite when you `tap` Hexi's `pointer`.
				//(The pointer also has `press` and `release` methods)
				g.pointer.tap = function () {

					//Supply `makeCat` with the pointer's `x` and `y` coordinates.
					makeCat(g.pointer.x, g.pointer.y);

					//Make the `message.content` display the number of cats
					message.content = "" + cats.children.length;
				};

				//Play an optional loaded sound file.
				var music = g.sound("sounds/music.wav");
				music.loop = true;
				music.play();

				//Set the game state to play. This is very important! Whatever
				//function you assign to Hexi's `state` property will be run by
				//Hexi in a loop.
				g.state = play;
			}

			/*
			4. The game logic
			------------------
			*/

			//The `play` function is called in a continuous loop, at whatever fps
			//(frames per second) value you set. This is your *game logic loop*. (The
			//render loop will be run by Hexi in the background at the maximum fps
			//your system can handle.) You can pause Hexi's game loop at any time
			//with the `pause` method, and restart it with the `resume` method

			function play() {
				//console.log(g.soundObjects["sounds/music.wav"].buffer);

				//Optionally, here's how you can make cats continuously if the pointer `isDown`
				//inside the game loop:
				/*
				if (g.pointer.isDown) {
				  makeCat(g.pointer.x, g.pointer.y);
				  message.content = `${cats.children.length} cats!`;
				}
				*/

				//Rotate the text
				message.rotation += 0.1;

				//Loop through all of the cats to make them move and bounce off the
				//edges of the stage
				cats.children.forEach(function (cat) {

					//Check for a collision between the cat and the stage boundaries
					//using Hexi's `contain` method. Setting `true` as the third
					//argument will make the cat bounce when it hits the stage
					//boundaries
					var collision = g.contain(cat, g.stage, true);

					//If there's no collision, the `collision` variable will be
					//`undefined`. But if there is a collision, it will have any of
					//the string values "left", "right", "top", or "bottom", depending
					//on which side of the stage the cat hit

					//Move the cat with the `move` method. The `move` method updates
					//the sprite's position by its `vx` and `vy` velocity values. (All Hexi
					//sprites have `vx` and `vy` properties, which are initialized to
					//zero). You can move more than one sprite at a time by supplying
					//`move` with a list of sprites, separated by commas.
					g.move(cat);

					//Here's what `move` is actually doing under the hood:
					//cat.x += cat.vx;
					//cat.y += cat.vy;
				});
			}

			/*
			With this basic Hexi architecture, you can create anything. Just set
			Hexi's `state` property to any other function to switch the
			behaviour of your application. Here's how:

			   g.state = anyStateFunction;

			Write as many state functions as you need.
			If it's a small project, you can keep all these functions in one file. But,
			for a big project, load your functions from
			external JS files as you need them. Use any module system you
			prefer, like ES6 modules, CommonJS, AMD, or good old HTML `<script>` tags.
			This simple architectural model can scale to any size, and is the only
			architectural model you need to know. Keep it simple and stay happy!
			*/
			//# sourceMappingURL=quickStart.js.map

		}
	});
});