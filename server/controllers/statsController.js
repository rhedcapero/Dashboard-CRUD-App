const { supabase, isConfigured } = require('../supabase');

// GET /api/dashboard/stats - Retrieve real-time dashboard statistics from Supabase
const getDashboardStats = async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Please add credentials to server/.env.',
      configured: false,
      stats: {
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
        recentlyAddedStudents: 0,
        recentStudents: []
      }
    });
  }

  try {
    // 1. Fetch all students to compute comprehensive accurate stats
    const { data: students, error } = await supabase
      .from('students')
      .select('id, student_id, first_name, last_name, email, course, year_level, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve stats from database: ' + error.message
      });
    }

    const totalStudents = students.length;
    let activeStudents = 0;
    let inactiveStudents = 0;

    // Define "recently added" as registered within the last 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    let recentlyAddedStudents = 0;

    const courseCounts = {};
    const yearLevelCounts = {};

    students.forEach((student) => {
      // Status
      if (student.status === 'Active') {
        activeStudents++;
      } else {
        inactiveStudents++;
      }

      // Recently added
      if (student.created_at && new Date(student.created_at) >= fourteenDaysAgo) {
        recentlyAddedStudents++;
      }

      // Course breakdown
      if (student.course) {
        courseCounts[student.course] = (courseCounts[student.course] || 0) + 1;
      }

      // Year level breakdown
      if (student.year_level) {
        yearLevelCounts[student.year_level] = (yearLevelCounts[student.year_level] || 0) + 1;
      }
    });

    // If no students in the last 14 days, provide the 5 most recent
    const recentStudents = students.slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        recentlyAddedStudents: recentlyAddedStudents || (students.length > 0 ? Math.min(students.length, 5) : 0),
        recentStudents,
        courseCounts,
        yearLevelCounts
      }
    });
  } catch (err) {
    console.error('Unexpected error in getDashboardStats:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred: ' + err.message
    });
  }
};

module.exports = {
  getDashboardStats
};
