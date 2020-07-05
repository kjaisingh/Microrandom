const geneticAlgorithm = require('./genetic.js');

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

module.exports = generateGroups;
