const app = require("./app/index");

const port = app.get("port");

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
