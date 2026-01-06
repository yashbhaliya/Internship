const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

mongoose.connect("mongodb+srv://Admin:Admin123@cluster0.gjj09mh.mongodb.net/Internship")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/internships", require("./internship_routes"));

app.get("/populate", async (req, res) => {
  try {
    const Internship = require("./internship");
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync("./internship.JSON", "utf8"));

    await Internship.deleteMany({});

    for (const item of data) {
      const min = Math.min(item.salary.min, item.salary.max);
      const max = Math.max(item.salary.min, item.salary.max);

      const internship = new Internship({
        id: item.id,
        title: item.title,
        salary: { min, max, currency: item.salary.currency },
        job_type: item.skills,
        referal_link: item.referal_link
      });

      await internship.save();
    }

    res.send("Data populated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
