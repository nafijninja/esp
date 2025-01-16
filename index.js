const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 6236;


app.get("/sim", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "sim.json");
    const data = JSON.parse(fs.readFileSync(filePath));
    const query = req.query.ask.toLowerCase();

    if (data.hasOwnProperty(query)) {
      const randomIndex = Math.floor(Math.random() * data[query].length);
      const responseData = data[query][randomIndex];

      return res.json({ respond: responseData });
    }

    return res.json({
      respond: "I don't understand what you're saying, please teach me.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ respond: "Internal Server Error" });
  }
});


app.get("/teach", (req, res) => {
  const ask = req.query.ask.toLowerCase();
  const ans = req.query.ans;

  if (!ask || !ans) return res.json({ err: "Missing ask or ans query!" });

  const filePath = path.join(__dirname, "data", "sim.json");

  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));

  const data = JSON.parse(fs.readFileSync(filePath));

  if (!data[ask]) data[ask] = [];

  data[ask].push(ans);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

  res.json({
    ask: ask,
    ans: ans,
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//html code  // Initialize app here

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));