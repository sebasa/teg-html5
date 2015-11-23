var Map = {

	Settings :{
		globalScale: ((document.documentElement.clientWidth / 2048 > document.documentElement.clientHeight / 1110)? document.documentElement.clientHeight / 1110:document.documentElement.clientWidth / 2048),
		colors: {yellow: '#ff0', green: '#0f0', blue: '#00f', red: '#f00', purple: '#f0f', cyan: '#00ffe4', white: '#fff', black: '#000'},
	},

	Territories: {},
	stage: null,
	mapLayer: null,
	topLayer:  null,
	tooltipLayer: null,
	backgroundLayer: null,
	text:null,


	init: function() {
		//Initiate our main Territories Object, it contains essential data about the territories current state
		Map.setUpTerritoriesObj();

		//Initiate a Kinetic stage
		Map.stage = new Kinetic.Stage({
			container: 'map',
			width: 2047*Map.Settings.globalScale,
			height: 1111*Map.Settings.globalScale
		});

		Map.mapLayer = new Kinetic.Layer({
			scaleX: Map.Settings.globalScale,
			scaleY: Map.Settings.globalScale,
		});

		Map.topLayer = new Kinetic.Layer({
			scaleX: Map.Settings.globalScale,
			scaleY: Map.Settings.globalScale,

		});
		
		Map.tooltipLayer = new Kinetic.Layer();

		Map.drawBackgroundImg();
		Map.drawTerritories();

		Map.stage.add(Map.backgroundLayer);
		Map.stage.add(Map.mapLayer);
		Map.stage.add(Map.topLayer);
		Map.stage.add(Map.tooltipLayer);

		Map.divideTerritories();
		Map.mapLayer.draw();
	},
	/**
	 * Initiate the  Map.Territories Object, this will contain essential informations about the territories 
	 */
	setUpTerritoriesObj: function() {
		for(id in TerritoryNames) {
			var pathObject = new Kinetic.Path({
				data: TerritoryPathData[id].path,
				id: id //set a unique id --> path.attrs.id
			});
			Map.Territories[id] = {
				name: TerritoryNames[id],
				path: pathObject,
				player: Math.floor(Math.random()*4),
				center: CenterPoints[id],
				color: null,
				neighbours: Neighbours[id],
				armyNum: Math.floor(1+Math.random()*8)
			};
		}
	},

	drawBackgroundImg: function() {
		Map.backgroundLayer = new Kinetic.Layer({
			scaleX: Map.Settings.globalScale,
			scaleY: Map.Settings.globalScale,
		});
		var imgObj = new Image();
		imgObj.src = 'img/map_grey.jpg';
		
		var img = new Kinetic.Image({
			image: imgObj,
			//alpha: 0.8
		});
		Map.backgroundLayer.add(img);
	},

	drawTerritories: function() {
		for (t in Map.Territories) {
			var path = Map.Territories[t].path;
			
			var group = new Kinetic.Group({
				y: 289,
				x: 659,
			});
			
			var tooltip = new Kinetic.Text({
				fontFamily: "Calibri",
				fontSize: 30,
				padding:5,
				textFill: "white",
				fill: "black",
				alpha: 0.75,
				visible: false
			});
			  
		  			//Asignar tropas
			var circle = new Kinetic.Circle({
				x: Map.Territories[t].center.x * 2.2,
				y: Map.Territories[t].center.y * 2.2 ,
				radius: 17,
				fill: "black",
				stroke: "#000",
				strokeWidth: 2,
			});
			
			var simpleText = new Kinetic.Text({
				x: Map.Territories[t].center.x * 2.2,
				y: Map.Territories[t].center.y * 2.2,
				text: Map.Territories[t].armyNum,
				fontSize: 27,
				fontFamily: 'Calibri',
				fill: 'white',
				offsetX: 6.5,
				offsetY: 13,
			});

			Map.topLayer.add(circle);
			Map.topLayer.add(simpleText);
			
			//We have to set up a group for proper mouseover on territories and sprite name images 
			group.add(path);
			Map.mapLayer.add(group);
			
			//Basic animations 
			//Wrap the 'path', 't' and 'group' variables inside a closure, and set up the mouseover / mouseout events for the demo
			//when you make a bigger application you should move this functionality out from here, and maybe put these 'actions' in a seperate function/'class'
			(function(path, t, group) {
				group.on('mousemove', function() {
					var mousePos = Map.stage.getPointerPosition();
					tooltip.setPosition(mousePos);
					tooltip.setText(path.attrs.id);
					tooltip.show();
					Map.tooltipLayer.add(tooltip);
					Map.tooltipLayer.draw();
				});					
				group.on('mouseover', function() {
					path.setFill('white');
					path.setOpacity(0.4)
					group.moveTo(Map.topLayer);
					Map.topLayer.drawScene();
				});

				group.on('mouseout', function() {
					tooltip.hide();
					Map.tooltipLayer.draw();
					
					path.setFill(Map.Settings.colors[Map.Territories[t].color]);
					path.setOpacity(0.3);
					group.moveTo(Map.mapLayer);
					Map.topLayer.draw();
				});

				group.on('click', function() {
					/*SAVE CENTER
					var mousePos = Map.stage.getPointerPosition();
					console.log(path.attrs.id + ": {x: " +  mousePos.x + ", y: " + mousePos.y + "},");*/
					/*var imageObj = new Image();
					
					imageObj.onload = function() {
					  var img = new Kinetic.Image({
						x: 300,
						y: 300,
						image: imageObj,
						width: 365,
						height: 301
					  });
					  Map.topLayer.add(img);
					};
					imageObj.src = 'img/1.jpg'
					
					Map.topLayer.draw();*/
					document.body.style.cursor =  "crosshair";
					location.hash = path.attrs.id;
				}); 
			})(path, t, group);
		}				
	},

	divideTerritories: function() {
				
		var colors = ['purple', 'green', 'blue','yellow','cyan'];
		for(var id in Map.Territories) {
			Map.Territories[id].color = colors[Map.Territories[id].player];
			Map.Territories[id].path.setFill(Map.Settings.colors[Map.Territories[id].color]);
			Map.Territories[id].path.setOpacity(0.4);			
		}
	}
}
