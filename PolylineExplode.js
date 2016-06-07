'use strict';

var core = require('flux/core');
var list = require("flux/list");
var modeling = require('flux-modelingjs').initialize().modeling;

/** Breaks a polyline (or a array of polylines) into a list of lines (or a array of array of lines)
 *
 *  @param  {[]*}   Polyline - entity or array
 *  @return {[]*}   Out - array of lines or array of array of lines
 * 
 */

function run(Polyline) {
	// Flatten input & initialization
	var input = list.Flatten(Polyline, false)
	var len = list.Length(input);
	var unit = input[0].units.points;
	// Setting up the elements units
	// modeling._defaultDimToUnits.length = unit
	// modeling.utilities.defaultUnits = unit;
	
	// Helper function which breaks a polyline in list of lines
	function explode(polylineJSON){
		// Extract points
		var pointsXYZ = polylineJSON.points
		var numPoints = pointsXYZ.length
		var output = [[],[]]
		// Loop over the points & create lines
		for (var i = 0; i < (numPoints - 1); i++){
			var objectLine = modeling.entities.line(pointsXYZ[i], pointsXYZ[i+1])
			var objectPoint = modeling.entities.point(pointsXYZ[i])
			objectLine.__data__.units.end = unit
			objectLine.__data__.units.start = unit
			objectPoint.__data__.units.point = unit
			output[0].push(objectLine)
			output[1].push(objectPoint)
		}
		return output
	}
	
	// Taking into account case with array input
	var outputL = []
	var outputP = []
	for (var i = 0; i < len; i++){
		outputL.push(explode(input[i])[0])
		outputP.push(explode(input[i])[1])
	}
	
	return { Segments: outputL, Vertices: outputP}
}

module.exports = {
    run: run
};
