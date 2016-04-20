try{
	var socket = io.connect('http://localhost:7001');
} catch(e){
	console.log(e);
}