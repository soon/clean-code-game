var CodeSample = require("./CodeSample");
// require levels variable

function getHash(){
	if (window && window.location && window.location.hash !== undefined && window.location.hash.length > 0)
		return Math.max(0, ~~window.location.hash.substring(1) - 1);
	else
		return 0;
}


var GameModel = Backbone.Model.extend({
	defaults: {
		levelIndex: getHash(),
		levels: levels,
		level: new CodeSample(levels[getHash()]),
		originalLevel: new CodeSample(levels[getHash()]),
		score: 0,
		maxScore: 0,
		penalty: {},
		levelPenalty: [],
	},

	reset: function(){
		this.set(this.defaults);
	},

	finishLevel: function(){
		var newLevelIndex = this.get('levelIndex')+1;
		var newLevel = newLevelIndex < this.get('levels').length ? new CodeSample(levels[newLevelIndex]) : null;
		var penalty = this.get('penalty');
		var levelPenalty = this.get('levelPenalty');
		_(levelPenalty).uniq().forEach(function(t){ penalty[t] = ~~penalty[t] + 1});
		this.set({
			maxScore: this.get('maxScore') + this.get('originalLevel').bugsCount,
			levelIndex: this.get('levelIndex')+1,
			level: newLevel,
			originalLevel: newLevel,
			penalty: penalty,
			levelPenalty: [],
		});
	},

	updatePenalty: function(){
		var bugs = _.values(this.get('level').bugs);
		return _.union(_.pluck(bugs, 'type'), this.get('levelPenalty'));
	},

	useHint: function(){
		this.set({
			score: Math.max(this.get('score') - 1, 0),
			levelPenalty: this.updatePenalty()
		});
	},

	missClick: function(){
		this.set({
			score: this.get('score') - 1,
			levelPenalty: this.updatePenalty()
		});
	},
})

module.exports = GameModel;