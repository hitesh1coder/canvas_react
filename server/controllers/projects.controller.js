const Project = require("../models/project.model");
const SaveProject = async (req, res) => {
  const { rectangles, circles, arrows, scribbles } = req.body;

  try {
    const addData = await new Project({
      rectangles,
      circles,
      arrows,
      scribbles,
    });
    res.status(201).json({ message: "data saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server Error for saving Data" });
  }
};

module.exports = {
  SaveProject,
};
