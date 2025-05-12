const express = require("express"); //run cmd to make node work, then 'npm install' in terminal to calll dependant node functions, when calling new functions run 'npm install FunctionName --save'
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.listen(3000, () => console.log("Listening on http://localhost:3000"));//when the node is run, opens the data on a server

async function getData(request, response){
    receive=5//This needs to be connected to the database
    console.log(receive);
    response.send(
        receive//this is what's returned to the function in PasswordJava
  )
}
app.post("/get-data", getData);//This makes the function getData read from another file and output the data into it