const PATH_TO_SPRITES = 'sprites/png/normal/';
const PATH_TO_SHINY_SPRITES = 'sprites/png/shiny/';
const SPRITE_EXTENTION = '.png';

const logInvalidRange = "[INVALID RANGE]: Invalid Value for key '{x}', value '{y}'  not in range [{z}]";
const logInvalidKey = "[INVALID KEY]: Invalid Key '{x}'"; //, see {wiki}"; //TODO wiki entry maybe
const logNoAmount = "[NO AMOUNT GIVEN]: Can't generate Pokemon without knowing how many to generate. Please add '{x}=(1-6)' to your request.";

var QUERY_MAP = null;

var apiObj = null;

if (typeof API_CALL === 'undefined') {
	API_CALL = true;
}
/** Called when the Generate button is clicked. */
function generateRandom() {
	markLoading(true);

	var options = getOptions();
	persistOptions(options);

	getEligiblePokemon(
		options,
		function(eligiblePokemon) {
			var results = document.getElementById("results");
			if (eligiblePokemon) {
				var generatedPokemon = chooseRandom(eligiblePokemon, options);
				var html = htmlifyPokemonArray(generatedPokemon, options);
				results.innerHTML = html;
			} else {
				results.innerHTML = "An error occurred while generating Pok&eacute;mon.";
			}
			markLoading(false);
		}
	);
}



// check if get param is valid or not
// returnobject contains (loggingString for invalid keys and values, optionmodel)
function checkGETParam(key, value, returnobject) {
	// check if param is valid
	if ((queryInstance = QUERY_MAP.get(key)) !== (null || undefined) ) {
		let isInRange = queryInstance.values.includes(value);
		if (isInRange) {
			// add option to optionmodel
			returnobject.optionmodel[queryInstance.key] = value;
		} else {
			returnobject.invalidvalue = logInvalidRange.replace("{x}", key).replace("{y}", value).replace("{z}", queryInstance.values);
			returnobject.invalidvalue += "\n";
		}
	}
	else {
		console.log("key is not valid");
		returnobject.invalidkey = logInvalidKey.replace("{x}", key);
		returnobject.invalidkey += "\n";
	}
}
function parseAPIParamsToOptions(query) {
	// everything which is not given is false
	
	let optionmodel = {
		n : "",
		region : "all",
		type : "all",
		ubers : "false",
		nfes : "false",
		sprites : "false",
		natures : "false",
		forms : "false",
		// default values 
		// ubers : "true",
		// nfes : "true",
		// sprites : "false",
		// natures : "true",
		// forms : "true",
	}
	let params = new URLSearchParams(query);

	//check if the important request parameter 'amount' n or number is given:
	let containsAmount = params.has("n") || params.has("number");
	if (containsAmount === false) {
		if (API_CALL) {
			apiObj.error = logNoAmount.replace("{x}", "n");
			return null;
		} else {
			document.querySelector("#results").innerHTML = logNoAmount.replace("{x}", "n");
			return null;
		}
	}

	//for logging if the value given through get is not an option (invalid)
	let loggingStringInvalidValue = "";
	//for logging if the key is not an option (invalid)
	let loggingStringInvalidKey = "";

	let returnobject = {
		invalidkey : loggingStringInvalidKey,
		invalidvalue :  loggingStringInvalidValue,
		optionmodel : optionmodel
	};

	for (let [key, value] of params) {
		checkGETParam(key, value, returnobject);
	}
	if (returnobject.invalidkey === "" && returnobject.invalidvalue === "") {
		// we have no errors, only then do something
		return returnobject.optionmodel;
		
	} else {
		if (API_CALL) {
			apiObj.error = returnobject.invalidkey + returnobject.invalidvalue;
		} else {
			document.querySelector("#results").innerHTML = returnobject.invalidkey + returnobject.invalidvalue;
		}
		return null;
	}
}
/** Called when the Webpage is called via GET-Query 
 *  callable through api interface
 *  callable through GET request on client side (only client.log output)
*/
function generateRandomByAPI(query) {

	//getValuesFromIndexPage();
	options = parseAPIParamsToOptions(query);
	if (options === null) {
		//nothing to do here
		return;
	}

	getEligiblePokemon(
		options,
		function(eligiblePokemon) {
			if (eligiblePokemon) {
				var generatedPokemon = chooseRandom(eligiblePokemon, options);
				console.log(generatedPokemon)
				apiObj.data = generatedPokemon;
			} else {
				if (API_CALL) {
					apiObj.error = "An error occurred while generating Pok&eacute;mon.";
				} else {
					var results = document.getElementById("results");
					results.innerHTML = "An error occurred while generating Pok&eacute;mon.";
				}
			}
			if (API_CALL === false) {
				markLoading(false);
			}
		}
	);
}


//wrapper to prevent direct call of same method
// so logging and debugging is easier.
function apiCall(map, query) {
	API_CALL = true;
	QUERY_MAP = map;
	apiObj = {
		name_List : [],
		data : [],
		error : null
	}

	generateRandomByAPI(query);

	// create name_list if only the names are interesting
	apiObj.data.map(e => {apiObj.name_List.push(e.name)})
	// remove unnecessary objects
	if (apiObj.error === null) {
		delete apiObj.error;
	} else {
		delete apiObj.data;
		delete apiObj.name_List;
	}
	return apiObj;
}

function markLoading(isLoading) {
	document.getElementById("controls").className = isLoading ? "loading" : "";
}

function getOptions() {
	return {
		n: Number(document.getElementById("n").value),
		region: document.getElementById("region").value,
		type: document.getElementById("type").value,
		ubers: document.getElementById("ubers").checked,
		nfes: document.getElementById("nfes").checked,
		sprites: document.getElementById("sprites").checked,
		natures: document.getElementById("natures").checked,
		forms: document.getElementById("forms").checked
	};
}

function setOptions(options) {
	document.getElementById("n").value = options.n;
	document.getElementById("region").value = options.region;
	document.getElementById("type").value = options.type;
	document.getElementById("ubers").checked = options.ubers;
	document.getElementById("nfes").checked = options.nfes;
	document.getElementById("sprites").checked = options.sprites;
	document.getElementById("natures").checked = options.natures;
	document.getElementById("forms").checked = options.forms;
}

// Cache the results of getEligiblePokemon by options.
var cachedOptionsJson;
var cachedEligiblePokemon;

function getEligiblePokemon(options, callback) {
	var optionsJson = JSON.stringify(options);

	if (cachedOptionsJson == optionsJson) {
		callback(cachedEligiblePokemon);
	} else {
		if(API_CALL === false) {
			var request = new XMLHttpRequest();
			request.onreadystatechange = function() {
				if (request.readyState == XMLHttpRequest.DONE) {
					if (request.status == 200) {
						var pokemonInRegion = JSON.parse(request.responseText);
						var eligiblePokemon = filterByOptions(pokemonInRegion, options);
						cachedOptionsJson = optionsJson;
						cachedEligiblePokemon = eligiblePokemon;
						callback(eligiblePokemon);
					} else {
						console.error(request);
						callback(null);
					}
				}
			};
			request.open("GET", "dex/" + options.region + ".json");
			request.send();
		} else {
			// backend - use filereader
			const fs= require("fs")
			let path = "./dex/" + options.region + ".json";
			let data = fs.readFileSync(path);
			if (data === (null || undefined)) {
				apiObj.errorRando = "Error on getting EligiblePokemon. error: " + err
			} else {
				var pokemonInRegion = JSON.parse(data);
				var eligiblePokemon = filterByOptions(pokemonInRegion, options);
				cachedOptionsJson = optionsJson;
				cachedEligiblePokemon = eligiblePokemon;
				callback(eligiblePokemon);
			}

		}
	}
}

function filterByOptions(pokemonInRegion, options) {
	return pokemonInRegion.filter(function (pokemon) {
		if (options.forms && "forms" in pokemon) {
			// If we are generating with forms and this Pok??mon has forms,
			// filter on them instead of the top-level Pok??mon.
			pokemon.forms = filterByOptions(pokemon.forms, options);
			return pokemon.forms.length > 0;
		}

		if (options.type != "all" && pokemon.types.indexOf(options.type) < 0) {
			return false;
		}

		if (!options.ubers && pokemon.isUber) {
			return false;
		}

		if (!options.nfes && pokemon.isNfe) {
			return false;
		}

		return true;
	});
}

/** Chooses N random Pok??mon from the array of eligibles without replacement. */
function chooseRandom(eligiblePokemon, options) {
	var chosenArray = [];

	// Deep copy so that we can modify the array as needed.
	var eligiblePokemon = JSON.parse(JSON.stringify(eligiblePokemon));

	while (eligiblePokemon.length > 0 && chosenArray.length < options.n) {
		var chosen = removeRandomElement(eligiblePokemon);

		if (options.forms && chosen.forms) {
			// Choose a random form, getting its ID from the top level.
			var randomForm = removeRandomElement(chosen.forms);
			randomForm.id = chosen.id;
			chosen = randomForm;

			// If we generated a mega, we can't choose any more.
			if (chosen.isMega) {
				eligiblePokemon = removeMegas(eligiblePokemon);
			}
			if (chosen.isGigantamax) {
				eligiblePokemon = removeGigantamaxes(eligiblePokemon);
			}
		}

		chosenArray.push(chosen);
	}

	// Megas are more likely to appear at the start of the array,
	// so we shuffle for good measure.
	return shuffle(chosenArray);
}

/** Filters megas from the array. Doesn't mutate the original array. */
function removeMegas(pokemonArray) {
	return pokemonArray.filter(function (pokemon) {
		if ("forms" in pokemon) {
			pokemon.forms = pokemon.forms.filter(function (form) {return !form.isMega});
			return pokemon.forms.length > 0;
		} else {
			return true; // always keep if no forms
		}
	});
}

/** Filters Gigantamax forms from the array. Doesn't mutate the original array. */
function removeGigantamaxes(pokemonArray) {
	return pokemonArray.filter(function (pokemon) {
		if ("forms" in pokemon) {
			pokemon.forms = pokemon.forms.filter(function (form) {return !form.isGigantamax});
			return pokemon.forms.length > 0;
		} else {
			return true; // always keep if no forms
		}
	});
}

/** Converts a JSON array of Pok??mon into an HTML ordered list. */
function htmlifyPokemonArray(generatedPokemon, options) {
	var output = "<ol>";
	for (var i=0; i<generatedPokemon.length; i++) {
		output += htmlifyPokemon(generatedPokemon[i], options);
	}
	output += "</ol>";

	return output;
}

/** Converts JSON for a single Pok??mon into an HTML list item. */
function htmlifyPokemon(pokemon, options) {
	// http://bulbapedia.bulbagarden.net/wiki/Shiny_Pok%C3%A9mon#Generation_VI
	var shiny = Math.floor(Math.random() * 65536) < 16;

	var title = (shiny ? "Shiny " : "") + pokemon.name;
	var classes = "";
	if (shiny) {
		classes += "shiny ";
	}
	if (!options.sprites) {
		classes += "imageless ";
	}

	var out = '<li title="' + title + '" class="' + classes + '">';

	if (options.natures) {
		out += '<span class="nature">' + generateNature() + "</span> ";
	}
	out += pokemon.name;
	if (shiny) {
		out += ' <span class="star">&#9733;</span>';
	}
	if (options.sprites) {
		var sprite = getSpritePath(pokemon, shiny);
		out += ' <img src="' + sprite + '" alt="' + title + '" title="' + title + '" />';
	}

	out += "</li>";

	return out;
}

function getSpritePath(pokemon, shiny) {
	var path = shiny ? PATH_TO_SHINY_SPRITES : PATH_TO_SPRITES;
	var name = pokemon.id;
	if (pokemon.spriteSuffix) {
		name = name + "-" + pokemon.spriteSuffix;
	}
	return path + name + SPRITE_EXTENTION;
}

function generateNature() {
	return getRandomElement(NATURES);
}

const NATURES = ["Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle", "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Na&iuml;ve", "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"];

function getRandomElement(arr) {
	return arr[randomInteger(arr.length)];
}

function removeRandomElement(arr) {
	return arr.splice(randomInteger(arr.length), 1)[0];
}

/** Modern Fisher-Yates shuffle. */
function shuffle(arr) {
	for (var i = arr.length - 1; i > 0; i--) {
		var j = randomInteger(i + 1);
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}

function randomInteger(maxExclusive) {
	return Math.floor(Math.random() * maxExclusive);
}

const STORAGE_OPTIONS_KEY = "options";

function persistOptions(options) {
	var optionsJson = JSON.stringify(options);
	window.localStorage.setItem(STORAGE_OPTIONS_KEY, optionsJson);
}

function loadOptions() {
	var optionsJson = window.localStorage.getItem(STORAGE_OPTIONS_KEY);
	if (optionsJson) {
		setOptions(JSON.parse(optionsJson));
	}
}

//only do that if this is not an api call
if(API_CALL === false) {
	document.addEventListener("DOMContentLoaded", loadOptions);
} else {
		module.exports = { apiCall};
}
