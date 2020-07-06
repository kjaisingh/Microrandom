
// function to generate initial groups
function generateGroups(members, groupCount) {
  var initialGroups = [];
  for (var i = 0; i < 10; i++) {
    initialGroups.push([]);
  }

  for (var i = 0; i < initialGroups.length; i++) {
    for(j = 0; j < groupCount; j++) {
      initialGroups[i].push([]);
    }
  }

  for (var i = 0; i < initialGroups.length; i++) {
    var membersCopy = members;
    membersCopy = shuffle(membersCopy);
    var group = 0;
    for(j = 0; j < membersCopy.length; j++) {
      initialGroups[i][group].push(membersCopy[j]);
      group += 1;
      if(Number(group) === Number(groupCount)) {
        group = 0;
      }
    }
  }

  for (var i = 0; i < initialGroups.length; i++) {
    for(j = 0; j < groupCount; j++) {
      console.log(initialGroups[i][j][0].name);
    }
  }

  const groupings = geneticAlgorithm(initialGroups);
  return groupings;
}

// function to shuffle items in array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// function to manage genetic algorithm
function geneticAlgorithm(initialGroups) {
  const scores = scoringSeeds(initialGroups);

  return initialGroups;
}

// higher score = greater variation
// function to score seed groups
function scoringSeeds(groups) {
  var scores = []
  scores = Array(groups.length).fill(0);
  var index = 0;

  groups.forEach(function(group) {
    group.forEach(function(subgroup) {

      var i;
      var j;
      var subscores = [0.0, 0.0, 0.0, 0.0];


      for(i = 0; i < subgroup.length; i++) {
        for(j = 0; j < subgroup.length; j++) {
          if(i !== j) {
            var ageScore = Math.abs(subgroup[i].age - subgroup[j].age);
            subscores[0] +=  ageScore / 4;
            subscores[1] += (subgroup[i].gender === subgroup[j].gender) ? 0 : 1;
            subscores[2] += (subgroup[i].ethnicity === subgroup[j].ethnicity) ? 0 : 1;
            subscores[3] += (subgroup[i].religion === subgroup[j].religion) ? 0 : 1;
          }
        }
      }

      subscore = subscores.reduce((a, b) => a + b, 0);
      scores[index] += subscore / (2 * subgroup.length);
      
    });

    index += 1;

  });

  console.log(scores);

  return scores;
}

module.exports = generateGroups;
