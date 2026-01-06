const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo error:", err));

// Schema
const InternshipSchema = new mongoose.Schema({
  title: String,
  job_type: [String],
  salary: Object
});

const Internship = mongoose.model("Internship", InternshipSchema);

// ✅ DELETE API
app.delete("/api/internships/:id", async (req, res) => {
  try {
    const deletedData = await Internship.findByIdAndDelete(req.params.id);

    if (!deletedData) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json({
      message: "Internship deleted successfully",
      data: deletedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
