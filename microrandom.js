
function generateGroups(members, maxGroup) {
  const groupings = ["Group A"];
  console.log(members[0].name);
  console.log(maxGroup);

  /* var i;
  var j;

  var roundOneGroups = [];
  for (var i = 0; i < 10; i++) {
    roundOneGroups.push([]);
  }

  for (var i = 0; i < roundOneGroups.length; i++) {
    for(j = 0; j < groupCount; j++) {
      roundOneGroups[i].push([]);
    }
  }

  console.log(roundOneGroups);


  for(i = 0; i < 10; i++) {
    var membersArray = members;
    j = 0;

    while(membersArray.length > 0) {
      console.log("Before");
      console.log(j);
      var randomIndex = Math.floor(Math.random() * membersArray.length);
      roundOneGroups[i][j].push(membersArray[randomIndex]);
      membersArray.splice(randomIndex, 1);

      j += 1;
      if(j === (groupCount - 1)) {
        j = 0;
      }
      console.log("After");
      console.log(j);
    }
  }

  for (var i = 0; i < roundOneGroups.length; i++) {
    for(j = 0; j < groupCount; j++) {
      console.log(roundOneGroups[i][j].length);
    }
  } */

  return groupings;
}

module.exports = generateGroups;
