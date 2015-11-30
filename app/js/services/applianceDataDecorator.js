var applianceDataDecorator = angular.module('ApplianceDataDecoratorService', []);

applianceDataDecorator.factory('$dataDecorator', ['$filter', function($filter) {
	return function(data) {
		// console.log(data);

		var relcodes = {
          'M1' : 'DC',
          'WH' : 'DW'
        }
        
		angular.forEach(data, function(item, key) {
			item.price = parseFloat(item.colours[0].prices.CAD);
			switch (item.appliance) {
				case "Washers":
					if ("dryers" in item && item.dryers.length) {
		                for (var i in item.colours) {
		                  for (var j in item.dryers[0].colours) {
		                    if (item.dryers[0].colours[j].colourCode == item.colours[i].colourCode) {
		                      item.colours[i].dryersku = item.dryers[0].colours[j].sku;
		                    }
		                  }
		                }
	            	} else {
	            		console.log('deleting washer '+item.sku+' since it doesn\'t have an associated dryer');
	            		delete data[item];
	            		return;
	            	}

                  if (parseFloat(item.capacity) >= 6.1) {
                    item.largestCapacity = true
                  } 
                  if (parseFloat(item.capacity) >= 5.2) {
                    item.largerCapacity = true
                  }
                  if (parseFloat(item.capacity) >= 5) {
                    item.largeCapacity = true
                  }
                  if (parseFloat(item.capacity) >= 4.8) {
                    item.mediumCapacity = true
                  }                    
                  if (parseFloat(item.capacity) >= 4.2) {
                    item.smallCapacity = true
                  }
                  break;
				case "Dishwashers":
					item.quiet = false
					if (parseFloat(item.decibels) <= 47) {
						item.quiet = true
					}
					break;
				case "Fridges":
					var height = Math.round(item.height);
					item["height"+height] = true;

					var width = Math.round(item.width);
					item["width"+width] = true;

					if (item.capacity <= 20) {
						item.mediumCapacity = true
					} else if (item.capacity <= 24.2) {
						item.largeCapacity = true
					} else if (item.capacity <= 25) {
						item.largerCapacity = true
					} else if (item.capacity > 25) {
						item.largestCapacity = true
					}

					if (item.sku.indexOf("GI15") > -1 || item.sku.indexOf("Gl15") > -1) {
						//imposter!
						data.splice(key, 1);
					}
					break;
				case "Cooking":
					switch(item.type) {
						case "Ranges":
							if (item.width <= 30) {
								item["width30"] = true
							} else if (item.width <= 36) {
								item["width36"] = true
							}

							if (item.capacity <= 5.1) {
								item.mediumCapacity = true
							} else if (item.capacity <= 5.8) {
								item.largeCapacity = true
							} else if (item.capacity <= 6.4) {
								item.largestCapacity = true
							}
							break;
						case "Ovens":
							if (item.width <= 24) {
								item["width24"] = true
							} else if (item.width <= 27) {
								item["width27"] = true
							} else if (item.width <= 30) {
								item["width30"] = true
							}

							if (item.capacity && item.capacity !== null && item.capacity >= 5) {
								item["5CuFt"] = true;
							} else {
								item["5CuFt"] = false;
							}
							break;
						case "Hoods":
							if (item.width <= 30) {
								item["width30"] = true
							} else if (item.width <= 50) {
								item["width36"] = true
							}

							if (item.cfm && typeof item.cfm !== null && item.cfm >= 340) {
								item["340CFMOrHigher"] = true;
							} else {
								item["340CFMOrHigher"] = false;
							}
							break;
						case "Cooktops":
							if (item.width <= 15) {
								item["width15"] = true
							} else if (item.width <= 30) {
								item["width30"] = true
							} else if (item.width <= 36) {
								item["width36"] = true
							} else if (item.width <= 48) {
								item["width48"] = true
							}
							break;
					}
					break;
			}
		})
		return $filter('orderBy')(data, '-price');
	};
}]);