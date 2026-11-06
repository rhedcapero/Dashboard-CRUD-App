const { supabase, isConfigured } = require('../supabase');

// Validation helper
const validateStudentInput = (body, isUpdate = false) => {
  const errors = [];
  const {
    student_id,
    first_name,
    last_name,
    email,
    contact_number,
    gender,
    course,
    year_level,
    status
  } = body;

  if (!isUpdate || student_id !== undefined) {
    if (!student_id || typeof student_id !== 'string' || !student_id.trim()) {
      errors.push('Student ID is required.');
    }
  }

  if (!isUpdate || first_name !== undefined) {
    if (!first_name || typeof first_name !== 'string' || !first_name.trim()) {
      errors.push('First Name is required.');
    }
  }

  if (!isUpdate || last_name !== undefined) {
    if (!last_name || typeof last_name !== 'string' || !last_name.trim()) {
      errors.push('Last Name is required.');
    }
  }

  if (!isUpdate || email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      errors.push('A valid Email address is required.');
    }
  }

  if (!isUpdate || contact_number !== undefined) {
    if (!contact_number || typeof contact_number !== 'string' || !contact_number.trim()) {
      errors.push('Contact Number is required.');
    }
  }

  if (!isUpdate || gender !== undefined) {
    if (!gender || typeof gender !== 'string' || !gender.trim()) {
      errors.push('Gender is required.');
    }
  }

  if (!isUpdate || course !== undefined) {
    if (!course || typeof course !== 'string' || !course.trim()) {
      errors.push('Course is required.');
    }
  }

  if (!isUpdate || year_level !== undefined) {
    if (!year_level || typeof year_level !== 'string' || !year_level.trim()) {
      errors.push('Year Level is required.');
    }
  }

  if (!isUpdate || status !== undefined) {
    if (!status || !['Active', 'Inactive'].includes(status)) {
      errors.push('Status must be either "Active" or "Inactive".');
    }
  }

  return errors;
};

// GET /api/students - Retrieve all students (with optional search, filter, and sorting)
const getAllStudents = async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Please add your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to server/.env.',
      configured: false,
      data: []
    });
  }

  try {
    const { search, course, year_level, status, sortBy = 'created_at', order = 'desc' } = req.query;

    let query = supabase.from('students').select('*');

    // Filtering by Course
    if (course && course.trim() !== 'All') {
      query = query.eq('course', course.trim());
    }

    // Filtering by Year Level
    if (year_level && year_level.trim() !== 'All') {
      query = query.eq('year_level', year_level.trim());
    }

    // Filtering by Status
    if (status && status.trim() !== 'All') {
      query = query.eq('status', status.trim());
    }

    // Search by Name (first_name, last_name), Student ID, or Email
    if (search && search.trim()) {
      const term = search.trim();
      // Supabase PostgREST 'or' syntax for multi-field search
      query = query.or(
        `student_id.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`
      );
    }

    // Sorting
    const ascending = order.toLowerCase() === 'asc';
    if (sortBy === 'name') {
      query = query.order('last_name', { ascending }).order('first_name', { ascending });
    } else if (sortBy === 'student_id') {
      query = query.order('student_id', { ascending });
    } else {
      // Default sort by created_at or registration date
      query = query.order('created_at', { ascending });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error (getAllStudents):', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve students from database: ' + error.message
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error('Unexpected error in getAllStudents:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred: ' + err.message
    });
  }
};

// GET /api/students/:id - Retrieve single student by ID
const getStudentById = async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Please add your credentials in server/.env.',
      configured: false
    });
  }

  try {
    const { id } = req.params;

    // Support lookup by UUID or student_id
    const isUuid = /^[0-9a-fA-F-]{36}$/.test(id);
    const lookupField = isUuid ? 'id' : 'student_id';

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq(lookupField, id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: `Student with ID "${id}" was not found.`
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Database error: ' + error.message
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Unexpected error in getStudentById:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred: ' + err.message
    });
  }
};

// POST /api/students - Add a new student
const createStudent = async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Please configure server/.env first.',
      configured: false
    });
  }

  try {
    const errors = validateStudentInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const newStudent = {
      student_id: req.body.student_id.trim(),
      first_name: req.body.first_name.trim(),
      last_name: req.body.last_name.trim(),
      email: req.body.email.trim().toLowerCase(),
      contact_number: req.body.contact_number.trim(),
      gender: req.body.gender.trim(),
      course: req.body.course.trim(),
      year_level: req.body.year_level.trim(),
      status: req.body.status || 'Active'
    };

    // Check if Student ID already exists in Supabase
    const { data: existingId } = await supabase
      .from('students')
      .select('id')
      .eq('student_id', newStudent.student_id)
      .maybeSingle();

    if (existingId) {
      return res.status(409).json({
        success: false,
        message: `Student ID "${newStudent.student_id}" is already registered. Please use a unique Student ID.`
      });
    }

    // Check if email address is already registered in Supabase
    const { data: existingEmail } = await supabase
      .from('students')
      .select('id')
      .eq('email', newStudent.email)
      .maybeSingle();

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Email address "${newStudent.email}" is already registered. Please use a different email.`
      });
    }

    const { data, error } = await supabase
      .from('students')
      .insert([newStudent])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      // PostgreSQL unique constraint violation code: 23505
      if (error.code === '23505') {
        const field = error.message.includes('student_id')
          ? 'Student ID'
          : error.message.includes('email')
          ? 'Email address'
          : 'field value';
        return res.status(409).json({
          success: false,
          message: `Duplicate entry: A student with this ${field} already exists.`
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create student: ' + error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      data
    });
  } catch (err) {
    console.error('Unexpected error in createStudent:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred: ' + err.message
    });
  }
};

// PUT /api/students/:id - Update existing student
const updateStudent = async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Please configure server/.env first.',
      configured: false
    });
  }

  try {
    const { id } = req.params;

    const errors = validateStudentInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const updates = {};
    if (req.body.student_id !== undefined) updates.student_id = req.body.student_id.trim();
    if (req.body.first_name !== undefined) updates.first_name = req.body.first_name.trim();
    if (req.body.last_name !== undefined) updates.last_name = req.body.last_name.trim();
    if (req.body.email !== undefined) updates.email = req.body.email.trim().toLowerCase();
    if (req.body.contact_number !== undefined) updates.contact_number = req.body.contact_number.trim();
    if (req.body.gender !== undefined) updates.gender = req.body.gender.trim();
    if (req.body.course !== undefined) updates.course = req.body.course.trim();
    if (req.body.year_level !== undefined) updates.year_level = req.body.year_level.trim();
    if (req.body.status !== undefined) updates.status = req.body.status.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update.'
      });
    }

    // Support updating by UUID or student_id
    const isUuid = /^[0-9a-fA-F-]{36}$/.test(id);
    const lookupField = isUuid ? 'id' : 'student_id';

    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq(lookupField, id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      if (error.code === '23505') {
        const field = error.message.includes('student_id')
          ? 'Student ID'
          : error.message.includes('email')
          ? 'Email address'
          : 'field value';
        return res.status(409).json({
          success: false,
          message: `Update failed: A student with this ${field} already exists.`
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update student: ' + error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully!',
      data
    });
  } catch (err) {
    console.error('Unexpected error in updateStudent:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred: ' + err.message
    });
  }
};

// DELETE /api/students/:id - Delete a student record
const deleteStudent = async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Please configure server/.env first.',
      configured: false
    });
  }

  try {
    const { id } = req.params;

    const isUuid = /^[0-9a-fA-F-]{36}$/.test(id);
    const lookupField = isUuid ? 'id' : 'student_id';

    // First check if the student exists and fetch info for response
    const { data: existingStudent, error: findError } = await supabase
      .from('students')
      .select('id, student_id, first_name, last_name')
      .eq(lookupField, id)
      .single();

    if (findError || !existingStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found.`
      });
    }

    const { error: deleteError } = await supabase
      .from('students')
      .delete()
      .eq(lookupField, id);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete student: ' + deleteError.message
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student ${existingStudent.first_name} ${existingStudent.last_name} (${existingStudent.student_id}) has been deleted successfully.`,
      deletedStudent: existingStudent
    });
  } catch (err) {
    console.error('Unexpected error in deleteStudent:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred: ' + err.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
