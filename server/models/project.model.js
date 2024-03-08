const mongoose = require("mongoose");
const arrowSchema = new mongoose.Schema({
  id: String,
  fillColor: String,
  points: [Number],
});
const rectangleSchema = new mongoose.Schema({
  id: String,
  fillColor: String,
  height: Number,
  width: Number,
  x: Number,
  y: Number,
});
const circleSchema = new mongoose.Schema({
  id: String,
  fillColor: String,
  radius: Number,
  x: Number,
  y: Number,
});
const scribleSchema = new mongoose.Schema({
  id: String,
  fillColor: String,
  points: [Number],
});

const projectSchema = new mongoose.Schema(
  {
    arrows: [arrowSchema],
    rectangles: [rectangleSchema],
    circles: [circleSchema],
    scribbles: [scribleSchema],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
