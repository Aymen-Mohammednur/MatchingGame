function addImg(inpArray){
	for (var obj of inpArray){
		var v = obj.value;
		var k = obj.kind;
		var cardPair = document.querySelectorAll(`.${k}`);
		cardPair.forEach(function(card){card.innerHTML = `<img src = ${v}></img>`;});
	}
}



//Uncomment the code below to see how it working.

// function demo(){
// 	class dict{
// 		constructor(v,k){
// 			this.value = v;
// 			this.kind = k;
// 		}
// 	}
// 	var ob1 = new dict("assets/img/sun.png", "red");
// 	var ob2 = new dict("assets/img/sun2.png", "blue");
// 	var obArray = [ob1, ob2];
// 	addImg(obArray);
// }
// demo();