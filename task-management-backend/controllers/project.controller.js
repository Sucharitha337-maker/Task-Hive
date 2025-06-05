const Project = require('../models/project.model');
const pool = require('../config/db');

// Create a new project
exports.create = async (req, res) => {
  if (!req.body.Name || !req.body.StartDate || !req.body.EndDate || !req.body.ProjectManagerID) {
    return res.status(400).json({
      success: false,
      message: "Project name, start date, end date, and manager ID are required"
    });
  }

  try {
    const newProject = new Project({
      ProjectID: req.body.ProjectID,
      Name: req.body.Name,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      ProjectManagerID: req.body.ProjectManagerID
    });

    const project = await Project.create(newProject);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({
      success: false,
      message: "Error creating project"
    });
  }
};

// Retrieve all projects
exports.findAll = async (req, res) => {
  try {
    const projects = await Project.getAll();
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error retrieving projects:', error.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving projects"
    });
  }
};

// Find a single project by ID
exports.findOne = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${projectId} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error retrieving project:', error.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving project"
    });
  }
};

// Update a project
exports.update = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const { Name, StartDate, EndDate, ProjectManagerID } = req.body;

  if (!Name || !StartDate || !EndDate || !ProjectManagerID) {
    return res.status(400).json({
      success: false,
      message: "Project name, start date, end date, and manager ID are required"
    });
  }

  try {
    const success = await Project.updateById(projectId, { Name, StartDate, EndDate, ProjectManagerID });

    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${projectId} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully"
    });
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({
      success: false,
      message: "Error updating project"
    });
  }
};

// Delete a project
exports.delete = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const success = await Project.remove(projectId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${projectId} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting project"
    });
  }
};