require("dotenv").config();
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

app.get("/", (req, res) => res.send("Hello from API"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
