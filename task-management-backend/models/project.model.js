const pool = require('../config/db');

class Project {
  constructor(project) {
    this.ProjectID = project.ProjectID;
    this.Name = project.Name;
    this.StartDate = project.StartDate;
    this.EndDate = project.EndDate;
    this.ProjectManagerID = project.ProjectManagerID;
  }

  static async create(newProject) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Project (ProjectID, Name, StartDate, EndDate, ProjectManagerID) VALUES (?, ?, ?, ?, ?)',
        [
          newProject.ProjectID,
          newProject.Name,
          newProject.StartDate,
          newProject.EndDate,
          newProject.ProjectManagerID
        ]
      );
      return newProject;
    } catch (error) {
      console.error('Database error during create:', error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM Project');
      return rows;
    } catch (error) {
      console.error('Database error during getAll:', error.message);
      throw error;
    }
  }

  static async findById(projectId) {
    try {
      const id = parseInt(projectId, 10);
      const [rows] = await pool.query('SELECT * FROM Project WHERE ProjectID = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Database error during findById:', error.message);
      throw error;
    }
  }

  static async updateById(id, project) {
    try {
      const projectId = parseInt(id, 10);
      const [result] = await pool.query(
        'UPDATE Project SET Name = ?, StartDate = ?, EndDate = ?, ProjectManagerID = ? WHERE ProjectID = ?',
        [project.Name, project.StartDate, project.EndDate, project.ProjectManagerID, projectId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error during updateById:', error.message);
      throw error;
    }
  }

  static async remove(id) {
    try {
      const projectId = parseInt(id, 10);
      const [result] = await pool.query('DELETE FROM Project WHERE ProjectID = ?', [projectId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error during remove:', error.message);
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('Cannot delete project because it has related tasks or comments.');
      }
      throw error;
    }
  }
}

module.exports = Project;
