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

// Populate route
app.get("/populate", async (req, res) => {
  try {
    const Internship = require("./internship");
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync("./internship.JSON", "utf8"));

    await Internship.deleteMany({});

    for (const item of data) {
      const min = Math.min(item.salary.min, item.salary.max);
      const max = Math.max(item.salary.min, item.salary.max);

      // Extract skills from job_type
      const skills = item.job_type.filter(j =>
        !j.includes('Stipend:') &&
        !j.includes('Work From Home') &&
        !j.includes('Onsite') &&
        !j.includes('Full Time') &&
        !j.includes('Part Time') &&
        !j.includes('Working Days:') &&
        !j.includes('Duration:') &&
        !j.includes('Internship Duration:') &&
        !j.includes('No prior experience') &&
        !j.includes('Letter of Recommendation') &&
        !j.includes('Certificate of Completion') &&
        !j.includes('Flexible Hours') &&
        !j.includes('Hybrid Working') &&
        j.length < 20
      );

      const internship = new Internship({
        id: item.id,
        title: item.title,
        salary: {
          min: min,
          max: max,
          currency: item.salary.currency
        },
        job_type: item.job_type,
        skills: skills,
        referal_link: item.referal_link
      });

      await internship.save();
    }

    res.send("Data populated successfully. <a href='/'>Go back</a>");
  } catch (error) {
    res.status(500).send("Error populating data: " + error.message);
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
