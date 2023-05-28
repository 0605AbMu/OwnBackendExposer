import {App} from "../src/index";
import {bookRouter} from "./Routers/book";

const app = new App();





app.Use("/home", bookRouter);


///Initializing;
app.Initialize();

app.listen(8080, "localhost");
console.log("Server listening http://localhost:8080")