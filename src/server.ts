import env from "./env";
import { app } from ".";

const port = env.PORT || 8000

app.listen(port , () => {
    console.log("running on port: " + port);
})