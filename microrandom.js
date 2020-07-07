
// function to generate initial groups
function generateGroups(members, groupCount) {
  var roundZeroGroups = [];
  var i;
  var j;

  for (i = 0; i < 10; i++) {
    roundZeroGroups.push([]);
  }

  for (i = 0; i < roundZeroGroups.length; i++) {
    for(j = 0; j < groupCount; j++) {
      roundZeroGroups[i].push([]);
    }
  }

  for (i = 0; i < roundZeroGroups.length; i++) {
    var membersCopy = members;
    membersCopy = shuffle(membersCopy);
    var group = 0;
    for(j = 0; j < membersCopy.length; j++) {
      roundZeroGroups[i][group].push(membersCopy[j]);
      group += 1;
      if(Number(group) === Number(groupCount)) {
        group = 0;
      }
    }
  }

  const roundOneGroups = geneticAlgorithm(roundZeroGroups).slice();
  const roundTwoGroups = geneticAlgorithm(roundOneGroups).slice();
  const roundThreeGroups = geneticAlgorithm(roundTwoGroups).slice();
  const roundFourGroups = geneticAlgorithm(roundThreeGroups).slice();
  const roundFiveGroups = geneticAlgorithm(roundFourGroups).slice();

  const finalScores = scoringSeeds(roundFiveGroups);
  const finalGroupingIndex = nthlargest(finalScores, 1);

  return roundFiveGroups[finalGroupingIndex];
}


// function for error checking
function printFirstNames(groups, groupCount) {
  var i;
  var j;
  var k;
  for (i = 0; i < groups.length; i++) {
    for(j = 0; j < groupCount; j++) {
      for(k = 0; k < groups[i][j].length; k++) {
        console.log(groups[i][j][k].name);
      }
    }
  }
}


// function to manage genetic algorithm
function geneticAlgorithm(initialGroups) {
  const scores = scoringSeeds(initialGroups);
  const newGroups = [];

  var i;
  var index;
  for (i = 1; i < 4; i++) {
    index = nthlargest(scores, i);
    newGroups.push(initialGroups[index]);
  }

  for(i = 0; i < 7; i++) {
    var baseGrouping = newGroups[Math.floor(Math.random() * 3)].slice();
    var copyGrouping = baseGrouping.slice();

    for(j = 0; j < 20; j++) {
      var subgroupOne = Math.floor(Math.random() * copyGrouping.length);
      var subgroupTwo = Math.floor(Math.random() * copyGrouping.length);
      var submemberOne = Math.floor(Math.random() * copyGrouping[subgroupOne].length);
      var submemberTwo = Math.floor(Math.random() * copyGrouping[subgroupTwo].length);

      var temp = copyGrouping[subgroupTwo][submemberTwo];
      copyGrouping[subgroupTwo][submemberTwo] = copyGrouping[subgroupOne][submemberOne];
      copyGrouping[subgroupOne][submemberOne] = temp;
    }
    newGroups.push(copyGrouping);
  }
  const scoresNew = scoringSeeds(newGroups);

  return newGroups;
}


// function to score seed groups (higher score indicates greater variation)
function scoringSeeds(groups) {
  var scores = []
  scores = Array(groups.length).fill(0);
  var index = 0;

  groups.forEach(function(group) {
    group.forEach(function(subgroup) {

      var subgroupScores = [0.0, 0.0, 0.0, 0.0];
      var i;
      var j;

      for(i = 0; i < subgroup.length; i++) {
        for(j = 0; j < subgroup.length; j++) {
          var ageScore = Math.abs(subgroup[i].age - subgroup[j].age);
          subgroupScores[0] +=  (ageScore / 4);
          subgroupScores[1] += (subgroup[i].gender === subgroup[j].gender) ? 0 : 1;
          subgroupScores[2] += (subgroup[i].ethnicity === subgroup[j].ethnicity) ? 0 : 1;
          subgroupScores[3] += (subgroup[i].religion === subgroup[j].religion) ? 0 : 1;

        }
      }

      var subgroupTotal = subgroupScores.reduce((a, b) => a + b, 0);
      scores[index] += ((subgroupTotal) / (2 * subgroup.length));
    });
    index += 1;
  });

  return scores;
}


// function to shuffle items in array
function shuffle(arr) {
  var currentIndex = arr.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}


// function to get index of nth largest element in array
function nthlargest(arr, highest) {
	var x = 0;
  var y = 0;
	var z = 0;
	var temp = 0;
	var tnum = arr.length;
	var flag = false;
  var result = false;

  while(x < tnum) {
		y = x + 1;
		if (y < tnum){
			for(z = y; z < tnum; z++) {
				if(arr[x] < arr[z]){
					temp = arr[z];
					arr[z] = arr[x];
					arr[x] = temp;
					flag = true;
				} else {
					continue;
				}
			}
		}
		if (flag) {
			flag = false;
		} else {
			x++;
			if (x === highest) {
				result = true;
			}
		}
		if (result) {
			break;
		}
	}
  return (highest - 1);
}


module.exports = generateGroups;
