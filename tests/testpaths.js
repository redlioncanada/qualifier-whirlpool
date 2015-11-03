// check(res.questions["Appliance"].text[0].answers[0],undefined,true);
// check(res.questions["Appliance"].text[0].answers[2],undefined,true);
// check(res.questions["Appliance"].text[0].answers[3],undefined,true);
// check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[0],undefined,true);
// check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[1],undefined,true);
// check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[2],undefined,true);
check(res.questions["Cooking - Pre-Qualifier 1"].text[0].answers[3],undefined,true);

function check(obj,lastQ,init) {
  console.log(obj);
  if (typeof init == 'undefined') init = false;

  if (!"previous" in obj && !init) {
    console.log('no prev found in '+obj.name);
    return;
  }
  if (!"next" in obj) {
    console.log('no next found in '+obj.name);
    return;
  }
  if (!res.questions[obj.next] && obj.next != null) {
    console.log(obj.name+ ': next question attribute '+obj.next+' does not exist');
    return;
  }
  if (!res.questions[obj.previous] && !init) {
    console.log(obj.name+ ': prev question attribute '+obj.previous+' does not exist');
  }
  if (obj.prev !== lastQ && !init) {
    console.log(obj.name+': prev question attribute '+obj.previous+' does not match the last question ('+lastQ+')');
  }
  if (obj.next != null && obj.next != "null") {
    check(res.questions[obj.next], obj.name);
  } else {
    console.log('path passed');
  }
}