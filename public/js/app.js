/**
 * ==============================================================================
 * EDUADMIN - STUDENT MANAGEMENT DASHBOARD JAVASCRIPT APPLICATION
 * Handles all client-side logic, API calls, CRUD modals, filters, and stats.
 * ==============================================================================
 */

// Application State
const state = {
  students: [],
  filteredStudents: [],
  stats: {
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    recentlyAddedStudents: 0,
    courseCounts: {},
    yearLevelCounts: {}
  },
  filters: {
    search: '',
    course: 'All',
    year_level: 'All',
    status: 'All',
    sort: 'date_desc'
  },
  serverConfig: {
    configured: false,
    supabaseUrl: ''
  },
  editingStudentId: null,
  studentToDelete: null,
  isLoading: false,
  searchDebounceTimer: null
};

// DOM Element Selectors
const DOM = {
  // Sidebar & Navigation
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  openSidebarBtn: document.getElementById('openSidebarBtn'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),
  navLinks: document.querySelectorAll('.sidebar-nav .nav-link[data-section]'),
  navOverview: document.getElementById('navOverview'),
  navStudents: document.getElementById('navStudents'),
  navAnalytics: document.getElementById('navAnalytics'),
  navStudentCount: document.getElementById('navStudentCount'),
  navDbConfig: document.getElementById('navDbConfig'),
  dbStatusDot: document.getElementById('dbStatusDot'),
  sidebarStatusPulse: document.getElementById('sidebarStatusPulse'),
  sidebarStatusTitle: document.getElementById('sidebarStatusTitle'),
  sidebarStatusDesc: document.getElementById('sidebarStatusDesc'),
  logoutBtn: document.getElementById('logoutBtn'),

  // Header Elements
  pageTitle: document.getElementById('pageTitle'),
  currentDateStr: document.getElementById('currentDateStr'),
  dbHeaderPill: document.getElementById('dbHeaderPill'),
  dbHeaderStatusText: document.getElementById('dbHeaderStatusText'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  refreshAllBtn: document.getElementById('refreshAllBtn'),
  headerAddStudentBtn: document.getElementById('headerAddStudentBtn'),

  // Alerts & Banners
  dbAlertBanner: document.getElementById('dbAlertBanner'),
  bannerConfigGuideBtn: document.getElementById('bannerConfigGuideBtn'),
  footerDbTag: document.getElementById('footerDbTag'),

  // Sections
  overviewSection: document.getElementById('overview-section'),
  studentsSection: document.getElementById('students-section'),
  analyticsSection: document.getElementById('analytics-section'),

  // Stats Elements
  statTotalStudents: document.getElementById('statTotalStudents'),
  statActiveStudents: document.getElementById('statActiveStudents'),
  statActivePercentage: document.getElementById('statActivePercentage'),
  statInactiveStudents: document.getElementById('statInactiveStudents'),
  statInactivePercentage: document.getElementById('statInactivePercentage'),
  statRecentStudents: document.getElementById('statRecentStudents'),
  courseBreakdownList: document.getElementById('courseBreakdownList'),
  recentStudentsList: document.getElementById('recentStudentsList'),
  viewAllStudentsLink: document.getElementById('viewAllStudentsLink'),
  totalCoursesBadge: document.getElementById('totalCoursesBadge'),
  analyticsCourseList: document.getElementById('analyticsCourseList'),
  analyticsYearList: document.getElementById('analyticsYearList'),

  // Table & Filter Controls
  tableRecordCountBadge: document.getElementById('tableRecordCountBadge'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  openAddStudentModalBtn: document.getElementById('openAddStudentModalBtn'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  filterCourse: document.getElementById('filterCourse'),
  filterYearLevel: document.getElementById('filterYearLevel'),
  filterStatus: document.getElementById('filterStatus'),
  sortOrder: document.getElementById('sortOrder'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  activeFilterPills: document.getElementById('activeFilterPills'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  tableSkeleton: document.getElementById('tableSkeleton'),
  emptyState: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptyDesc: document.getElementById('emptyDesc'),
  emptyResetBtn: document.getElementById('emptyResetBtn'),
  emptyAddBtn: document.getElementById('emptyAddBtn'),
  showingCount: document.getElementById('showingCount'),
  totalCountInTable: document.getElementById('totalCountInTable'),

  // Student Form Modal
  studentFormModal: document.getElementById('studentFormModal'),
  closeFormModalBtn: document.getElementById('closeFormModalBtn'),
  cancelFormModalBtn: document.getElementById('cancelFormModalBtn'),
  studentForm: document.getElementById('studentForm'),
  formModalTitle: document.getElementById('formModalTitle'),
  formModalSubtitle: document.getElementById('formModalSubtitle'),
  formStudentDbId: document.getElementById('formStudentDbId'),
  formStudentId: document.getElementById('formStudentId'),
  autoGenerateIdBtn: document.getElementById('autoGenerateIdBtn'),
  formFirstName: document.getElementById('formFirstName'),
  formLastName: document.getElementById('formLastName'),
  formEmail: document.getElementById('formEmail'),
  formContactNumber: document.getElementById('formContactNumber'),
  formGender: document.getElementById('formGender'),
  formCourse: document.getElementById('formCourse'),
  formYearLevel: document.getElementById('formYearLevel'),
  formStatus: document.getElementById('formStatus'),
  formErrorBanner: document.getElementById('formErrorBanner'),
  formErrorMessage: document.getElementById('formErrorMessage'),
  saveStudentSubmitBtn: document.getElementById('saveStudentSubmitBtn'),
  saveSpinner: document.getElementById('saveSpinner'),
  saveBtnText: document.getElementById('saveBtnText'),

  // View Student Modal
  viewStudentModal: document.getElementById('viewStudentModal'),
  closeViewModalBtn: document.getElementById('closeViewModalBtn'),
  closeViewModalBtn2: document.getElementById('closeViewModalBtn2'),
  viewAvatar: document.getElementById('viewAvatar'),
  viewFullName: document.getElementById('viewFullName'),
  viewStudentId: document.getElementById('viewStudentId'),
  viewStatusBadge: document.getElementById('viewStatusBadge'),
  viewEmail: document.getElementById('viewEmail'),
  viewContact: document.getElementById('viewContact'),
  viewCourse: document.getElementById('viewCourse'),
  viewYearLevel: document.getElementById('viewYearLevel'),
  viewGender: document.getElementById('viewGender'),
  viewRegisteredDate: document.getElementById('viewRegisteredDate'),
  viewRecordId: document.getElementById('viewRecordId'),
  viewEditBtn: document.getElementById('viewEditBtn'),
  viewDeleteBtn: document.getElementById('viewDeleteBtn'),

  // Delete Confirm Modal
  deleteConfirmModal: document.getElementById('deleteConfirmModal'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  deleteStudentName: document.getElementById('deleteStudentName'),
  deleteStudentId: document.getElementById('deleteStudentId'),
  deleteSpinner: document.getElementById('deleteSpinner'),
  deleteBtnText: document.getElementById('deleteBtnText'),

  // DB Config Modal
  dbConfigModal: document.getElementById('dbConfigModal'),
  closeDbModalBtn: document.getElementById('closeDbModalBtn'),
  closeDbModalBtn2: document.getElementById('closeDbModalBtn2'),
  dbStatusModalBanner: document.getElementById('dbStatusModalBanner'),
  copySqlPathBtn: document.getElementById('copySqlPathBtn'),
  testDbConnectionBtn: document.getElementById('testDbConnectionBtn'),

  // Logout Modal
  logoutModal: document.getElementById('logoutModal'),
  cancelLogoutBtn: document.getElementById('cancelLogoutBtn'),
  confirmLogoutBtn: document.getElementById('confirmLogoutBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// ==============================================================================
// INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDateDisplay();
  setupEventListeners();
  checkServerHealth();
  loadDashboardData();
});

// Set current date in header
function initDateDisplay() {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  DOM.currentDateStr.textContent = new Date().toLocaleDateString('en-US', options);
}

// ==============================================================================
// THEME MANAGEMENT (Dark / Light)
// ==============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('eduadmin_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('eduadmin_theme', newTheme);
  showToast('info', 'Theme Changed', `Switched to ${newTheme} theme mode.`);
}

// ==============================================================================
// API CALLS & DATA RETRIEVAL
// ==============================================================================

/**
 * Check backend and Supabase connection status
 */
async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();

    state.serverConfig.configured = data.supabase && data.supabase.configured;
    state.serverConfig.supabaseUrl = data.supabase ? data.supabase.url : '';

    updateDbStatusUI(state.serverConfig.configured, state.serverConfig.supabaseUrl);
  } catch (err) {
    console.error('Server health check failed:', err);
    updateDbStatusUI(false, 'Unable to connect to backend server');
  }
}

/**
 * Update UI indicators based on database connection state
 */
function updateDbStatusUI(isConfigured, url) {
  if (isConfigured) {
    if (DOM.dbStatusDot) DOM.dbStatusDot.classList.add('active');
    if (DOM.sidebarStatusPulse) DOM.sidebarStatusPulse.classList.add('connected');
    if (DOM.sidebarStatusTitle) DOM.sidebarStatusTitle.textContent = 'Supabase Connected';
    if (DOM.sidebarStatusDesc) DOM.sidebarStatusDesc.textContent = 'PostgreSQL database is online & synced';
    if (DOM.dbHeaderPill) DOM.dbHeaderPill.classList.add('active');
    if (DOM.dbHeaderStatusText) DOM.dbHeaderStatusText.textContent = 'Supabase Active';
    if (DOM.dbAlertBanner) DOM.dbAlertBanner.classList.add('hidden');
    if (DOM.footerDbTag) DOM.footerDbTag.textContent = '🟢 Supabase PostgreSQL Active';
  } else {
    if (DOM.dbStatusDot) DOM.dbStatusDot.classList.remove('active');
    if (DOM.sidebarStatusPulse) DOM.sidebarStatusPulse.classList.remove('connected');
    if (DOM.sidebarStatusTitle) DOM.sidebarStatusTitle.textContent = 'Setup Required';
    if (DOM.sidebarStatusDesc) DOM.sidebarStatusDesc.textContent = 'Configure credentials in server/.env';
    if (DOM.dbHeaderPill) DOM.dbHeaderPill.classList.remove('active');
    if (DOM.dbHeaderStatusText) DOM.dbHeaderStatusText.textContent = 'Config Required';
    if (DOM.dbAlertBanner) DOM.dbAlertBanner.classList.remove('hidden');
    if (DOM.footerDbTag) DOM.footerDbTag.textContent = '🟠 Database Setup Needed';
  }
}

/**
 * Fetch dashboard statistics
 */
async function loadStats() {
  try {
    const res = await fetch('/api/dashboard/stats');
    const result = await res.json();

    if (result.success && result.stats) {
      state.stats = result.stats;
      renderStatsCards(result.stats);
      renderCourseBreakdown(result.stats.courseCounts || {}, result.stats.totalStudents || 0);
      renderRecentStudentsList(result.stats.recentStudents || []);
      renderAnalyticsSection(result.stats);
    } else {
      console.warn('Stats response warning:', result.message);
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
  }
}

/**
 * Fetch students list based on current filters and sorting
 */
async function loadStudents() {
  setLoadingState(true);

  try {
    // Map sort dropdown to API query parameters
    let sortBy = 'created_at';
    let order = 'desc';

    switch (state.filters.sort) {
      case 'date_asc':
        sortBy = 'created_at';
        order = 'asc';
        break;
      case 'date_desc':
        sortBy = 'created_at';
        order = 'desc';
        break;
      case 'name_asc':
        sortBy = 'name';
        order = 'asc';
        break;
      case 'name_desc':
        sortBy = 'name';
        order = 'desc';
        break;
      case 'id_asc':
        sortBy = 'student_id';
        order = 'asc';
        break;
    }

    const params = new URLSearchParams({
      search: state.filters.search,
      course: state.filters.course,
      year_level: state.filters.year_level,
      status: state.filters.status,
      sortBy,
      order
    });

    const res = await fetch(`/api/students?${params.toString()}`);
    const result = await res.json();

    if (result.success) {
      state.students = result.data || [];
      renderStudentsTable(state.students);
      DOM.navStudentCount.textContent = result.count || 0;
      DOM.tableRecordCountBadge.textContent = `${result.count || 0} Students`;
    } else {
      showToast('error', 'Failed to Load Students', result.message || 'Database error occurred.');
      renderStudentsTable([]);
    }
  } catch (err) {
    console.error('Error fetching students:', err);
    showToast('error', 'Network Error', 'Could not connect to the backend server.');
    renderStudentsTable([]);
  } finally {
    setLoadingState(false);
  }
}

/**
 * Load all dashboard data (stats + students)
 */
async function loadDashboardData() {
  await Promise.all([loadStats(), loadStudents()]);
}

// ==============================================================================
// UI RENDERING FUNCTIONS
// ==============================================================================

/**
 * Render the 4 main summary cards
 */
function renderStatsCards(stats) {
  const total = stats.totalStudents || 0;
  const active = stats.activeStudents || 0;
  const inactive = stats.inactiveStudents || 0;
  const recent = stats.recentlyAddedStudents || 0;

  DOM.statTotalStudents.textContent = total;
  DOM.statActiveStudents.textContent = active;
  DOM.statInactiveStudents.textContent = inactive;
  DOM.statRecentStudents.textContent = recent;

  // Compute percentages
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

  DOM.statActivePercentage.textContent = `${activePercent}%`;
  DOM.statInactivePercentage.textContent = `${inactivePercent}%`;
}

/**
 * Render Degree Program distribution progress bars
 */
function renderCourseBreakdown(courseCounts, total) {
  const DEGREE_PROGRAMS = [
    'BS in Hospitality Management',
    'BS in Criminal Justice Education',
    'BS in Teacher Education',
    'BS in Agri Business',
    'BS in Information Technology'
  ];

  // Include the 5 canonical programs plus any others present in the database
  const courses = [...DEGREE_PROGRAMS];
  Object.keys(courseCounts).forEach(c => {
    if (!courses.includes(c)) {
      courses.push(c);
    }
  });

  DOM.totalCoursesBadge.textContent = `${courses.length} Programs`;

  if (total === 0 && Object.keys(courseCounts).length === 0) {
    DOM.courseBreakdownList.innerHTML = `
      <div style="padding: 16px 0; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
        No course enrollment data found in database.
      </div>`;
    return;
  }

  let html = '';
  courses.forEach(course => {
    const count = courseCounts[course] || 0;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;

    html += `
      <div class="course-bar-item">
        <div class="course-bar-meta">
          <span class="course-bar-name">${escapeHtml(course)}</span>
          <span class="course-bar-count">${count} (${percent}%)</span>
        </div>
        <div class="course-bar-track">
          <div class="course-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  });

  DOM.courseBreakdownList.innerHTML = html;
}

/**
 * Render recently registered students list widget
 */
function renderRecentStudentsList(recentStudents) {
  if (!recentStudents || recentStudents.length === 0) {
    DOM.recentStudentsList.innerHTML = `
      <div style="padding: 16px 0; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
        No students registered yet.
      </div>`;
    return;
  }

  let html = '';
  recentStudents.forEach(student => {
    const initials = getInitials(student.first_name, student.last_name);
    const dateStr = formatDate(student.created_at);

    html += `
      <div class="recent-student-item">
        <div class="recent-student-left">
          <div class="recent-avatar">${initials}</div>
          <div>
            <div class="recent-name">${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</div>
            <div class="recent-course">${escapeHtml(student.course)} &bull; ${escapeHtml(student.year_level)}</div>
          </div>
        </div>
        <div class="recent-date">${dateStr}</div>
      </div>
    `;
  });

  DOM.recentStudentsList.innerHTML = html;
}

/**
 * Render students data table
 */
function renderStudentsTable(students) {
  DOM.studentsTableBody.innerHTML = '';
  const count = students.length;

  DOM.showingCount.textContent = count;
  DOM.totalCountInTable.textContent = state.stats.totalStudents || count;

  if (count === 0) {
    DOM.emptyState.classList.remove('hidden');
    if (state.filters.search || state.filters.course !== 'All' || state.filters.year_level !== 'All' || state.filters.status !== 'All') {
      DOM.emptyTitle.textContent = 'No Matching Records';
      DOM.emptyDesc.textContent = 'No students match your active filters. Try adjusting or resetting your search filters.';
      DOM.emptyResetBtn.classList.remove('hidden');
    } else {
      DOM.emptyTitle.textContent = 'No Students Registered';
      DOM.emptyDesc.textContent = 'Your Supabase database is empty. Click "+ Add New Student" to register your first record!';
      DOM.emptyResetBtn.classList.add('hidden');
    }
    return;
  }

  DOM.emptyState.classList.add('hidden');

  let rowsHtml = '';
  students.forEach(student => {
    const initials = getInitials(student.first_name, student.last_name);
    const statusClass = student.status === 'Active' ? 'badge-active' : 'badge-inactive';
    const formattedDate = formatDate(student.created_at);

    rowsHtml += `
      <tr data-id="${student.id}">
        <td class="col-student-id">${escapeHtml(student.student_id)}</td>
        <td>
          <div class="student-info-cell">
            <div class="student-table-avatar">${initials}</div>
            <div>
              <span class="student-name-text">${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</span>
              <span class="student-email-text">${escapeHtml(student.email)}</span>
            </div>
          </div>
        </td>
        <td>${escapeHtml(student.contact_number)}</td>
        <td>${escapeHtml(student.gender)}</td>
        <td>${escapeHtml(student.course)}</td>
        <td><span class="badge badge-light">${escapeHtml(student.year_level)}</span></td>
        <td><span class="badge ${statusClass}">${escapeHtml(student.status)}</span></td>
        <td>${formattedDate}</td>
        <td>
          <div class="row-actions">
            <button class="table-action-btn btn-view" onclick="handleViewStudent('${student.id}')" title="View Student Profile">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="table-action-btn btn-edit" onclick="handleEditStudent('${student.id}')" title="Edit Student Record">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="table-action-btn btn-delete" onclick="handleDeletePrompt('${student.id}')" title="Delete Student Record">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  DOM.studentsTableBody.innerHTML = rowsHtml;
}

/**
 * Render detailed course & year analytics section
 */
function renderAnalyticsSection(stats) {
  const courseCounts = stats.courseCounts || {};
  const yearCounts = stats.yearLevelCounts || {};
  const total = stats.totalStudents || 0;

  // Course Breakdown
  const DEGREE_PROGRAMS = [
    'BS in Hospitality Management',
    'BS in Criminal Justice Education',
    'BS in Teacher Education',
    'BS in Agri Business',
    'BS in Information Technology'
  ];

  const courses = [...DEGREE_PROGRAMS];
  Object.keys(courseCounts).forEach(c => {
    if (!courses.includes(c)) {
      courses.push(c);
    }
  });

  DOM.analyticsCourseList.innerHTML = courses.map(course => {
    const count = courseCounts[course] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `
      <div class="course-bar-item">
        <div class="course-bar-meta">
          <span class="course-bar-name">${escapeHtml(course)}</span>
          <span class="course-bar-count">${count} students (${pct}%)</span>
        </div>
        <div class="course-bar-track">
          <div class="course-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  // Year Level Breakdown
  const yearEntries = Object.entries(yearCounts);
  if (yearEntries.length === 0) {
    DOM.analyticsYearList.innerHTML = `<p style="color: var(--text-muted);">No records available.</p>`;
  } else {
    DOM.analyticsYearList.innerHTML = yearEntries.map(([year, count]) => {
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div class="course-bar-item">
          <div class="course-bar-meta">
            <span class="course-bar-name">${escapeHtml(year)}</span>
            <span class="course-bar-count">${count} students (${pct}%)</span>
          </div>
          <div class="course-bar-track">
            <div class="course-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #10b981, #06b6d4);"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

/**
 * Render active filter badges bar
 */
function updateActiveFilterPills() {
  const pills = [];

  if (state.filters.search) {
    pills.push(`Search: "${escapeHtml(state.filters.search)}"`);
  }
  if (state.filters.course !== 'All') {
    pills.push(`Course: ${escapeHtml(state.filters.course)}`);
  }
  if (state.filters.year_level !== 'All') {
    pills.push(`Year: ${escapeHtml(state.filters.year_level)}`);
  }
  if (state.filters.status !== 'All') {
    pills.push(`Status: ${escapeHtml(state.filters.status)}`);
  }

  if (pills.length === 0) {
    DOM.activeFilterPills.classList.add('hidden');
    DOM.activeFilterPills.innerHTML = '';
  } else {
    DOM.activeFilterPills.classList.remove('hidden');
    DOM.activeFilterPills.innerHTML = `
      <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 500;">Active Filters:</span>
      ${pills.map(p => `<span class="filter-pill">${p}</span>`).join('')}
    `;
  }
}

// Table loading skeleton helper
function setLoadingState(loading) {
  state.isLoading = loading;
  if (loading) {
    DOM.tableSkeleton.classList.remove('hidden');
  } else {
    DOM.tableSkeleton.classList.add('hidden');
  }
}

// ==============================================================================
// CRUD MODAL HANDLERS
// ==============================================================================

/**
 * Open Modal to Add a New Student
 */
function openAddStudentModal() {
  state.editingStudentId = null;
  resetStudentForm();
  DOM.formModalTitle.textContent = 'Add New Student';
  DOM.formModalSubtitle.textContent = 'Fill in the student details to register in the Supabase database';
  DOM.saveBtnText.textContent = 'Add Student';
  const icon = DOM.saveStudentSubmitBtn.querySelector('.btn-icon');
  if (icon) {
    icon.remove();
  }
  DOM.studentFormModal.classList.remove('hidden');
}

/**
 * Open Modal to Edit an Existing Student
 */
async function handleEditStudent(id) {
  // Check if student exists in state first for instant opening
  let student = state.students.find(s => s.id === id);

  if (!student) {
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();
      if (data.success) {
        student = data.data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!student) {
    showToast('error', 'Error', 'Could not locate student details.');
    return;
  }

  state.editingStudentId = student.id;
  resetStudentForm();

  // Populate form fields
  DOM.formStudentDbId.value = student.id;
  DOM.formStudentId.value = student.student_id;
  DOM.formFirstName.value = student.first_name;
  DOM.formLastName.value = student.last_name;
  DOM.formEmail.value = student.email;
  DOM.formContactNumber.value = student.contact_number;
  DOM.formGender.value = student.gender;
  DOM.formCourse.value = student.course;
  DOM.formYearLevel.value = student.year_level;
  DOM.formStatus.value = student.status;

  DOM.formModalTitle.textContent = 'Edit Student Information';
  DOM.formModalSubtitle.textContent = `Update records for ${student.first_name} ${student.last_name} (${student.student_id})`;
  DOM.saveBtnText.textContent = 'Update Student';
  const icon = DOM.saveStudentSubmitBtn.querySelector('.btn-icon');
  if (icon) {
    icon.innerHTML = `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>`;
    icon.classList.remove('hidden');
  }

  // If view modal was open, close it
  DOM.viewStudentModal.classList.add('hidden');
  DOM.studentFormModal.classList.remove('hidden');
}

/**
 * Open Profile View Modal
 */
async function handleViewStudent(id) {
  let student = state.students.find(s => s.id === id);

  if (!student) {
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();
      if (data.success) {
        student = data.data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!student) {
    showToast('error', 'Error', 'Could not load student profile.');
    return;
  }

  DOM.viewAvatar.textContent = getInitials(student.first_name, student.last_name);
  DOM.viewFullName.textContent = `${student.first_name} ${student.last_name}`;
  DOM.viewStudentId.textContent = student.student_id;
  DOM.viewStatusBadge.textContent = student.status;
  DOM.viewStatusBadge.className = `badge ${student.status === 'Active' ? 'badge-active' : 'badge-inactive'}`;
  DOM.viewEmail.textContent = student.email;
  DOM.viewContact.textContent = student.contact_number;
  DOM.viewCourse.textContent = student.course;
  DOM.viewYearLevel.textContent = student.year_level;
  DOM.viewGender.textContent = student.gender;
  DOM.viewRegisteredDate.textContent = formatDate(student.created_at, true);
  DOM.viewRecordId.textContent = student.id;

  // Bind edit & delete buttons inside view modal
  DOM.viewEditBtn.onclick = () => handleEditStudent(student.id);
  DOM.viewDeleteBtn.onclick = () => {
    DOM.viewStudentModal.classList.add('hidden');
    handleDeletePrompt(student.id);
  };

  DOM.viewStudentModal.classList.remove('hidden');
}

/**
 * Prompt Delete Confirmation Dialog
 */
function handleDeletePrompt(id) {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  state.studentToDelete = student;
  DOM.deleteStudentName.textContent = `${student.first_name} ${student.last_name}`;
  DOM.deleteStudentId.textContent = student.student_id;
  DOM.deleteConfirmModal.classList.remove('hidden');
}

/**
 * Execute Student Deletion
 */
async function executeDeleteStudent() {
  if (!state.studentToDelete) return;

  setDeleteBtnLoading(true);

  try {
    const res = await fetch(`/api/students/${state.studentToDelete.id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showToast('success', 'Student Deleted', `Record for ${state.studentToDelete.first_name} ${state.studentToDelete.last_name} was removed from Supabase.`);
      DOM.deleteConfirmModal.classList.add('hidden');
      state.studentToDelete = null;

      // Immediately refresh stats & table
      await loadDashboardData();
    } else {
      showToast('error', 'Delete Failed', data.message || 'Could not delete student.');
    }
  } catch (err) {
    console.error('Delete error:', err);
    showToast('error', 'Network Error', 'Failed to communicate with backend server.');
  } finally {
    setDeleteBtnLoading(false);
  }
}

/**
 * Handle Student Form Submission (Create or Update)
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  // Validate form
  const isValid = validateStudentForm();
  if (!isValid) return;

  const payload = {
    student_id: DOM.formStudentId.value.trim(),
    first_name: DOM.formFirstName.value.trim(),
    last_name: DOM.formLastName.value.trim(),
    email: DOM.formEmail.value.trim().toLowerCase(),
    contact_number: DOM.formContactNumber.value.trim(),
    gender: DOM.formGender.value,
    course: DOM.formCourse.value,
    year_level: DOM.formYearLevel.value,
    status: DOM.formStatus.value
  };

  setSaveBtnLoading(true);

  try {
    let res;
    const isEdit = Boolean(state.editingStudentId);

    if (isEdit) {
      res = await fetch(`/api/students/${state.editingStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (res.ok && data.success) {
      showToast('success', isEdit ? 'Record Updated' : 'Student Registered', data.message || 'Operation completed successfully.');
      DOM.studentFormModal.classList.add('hidden');
      resetStudentForm();

      // Refresh dashboard data
      await loadDashboardData();
    } else {
      // Show form error banner
      DOM.formErrorBanner.classList.remove('hidden');
      DOM.formErrorMessage.textContent = data.message || 'Failed to save student record.';
      showToast('error', isEdit ? 'Update Failed' : 'Registration Failed', data.message || 'Please check your inputs.');
      if (data.message && data.message.toLowerCase().includes('student id')) {
        setFieldError('student_id', data.message);
      } else if (data.message && data.message.toLowerCase().includes('email')) {
        setFieldError('email', data.message);
      }
    }
  } catch (err) {
    console.error('Save error:', err);
    DOM.formErrorBanner.classList.remove('hidden');
    DOM.formErrorMessage.textContent = 'Server connection error: ' + err.message;
    showToast('error', 'Network Error', 'Could not reach server.');
  } finally {
    setSaveBtnLoading(false);
  }
}

/**
 * Client-side Form Validation
 */
function validateStudentForm() {
  let valid = true;
  clearFieldErrors();

  const idVal = DOM.formStudentId.value.trim();
  const firstVal = DOM.formFirstName.value.trim();
  const lastVal = DOM.formLastName.value.trim();
  const emailVal = DOM.formEmail.value.trim();
  const contactVal = DOM.formContactNumber.value.trim();
  const genderVal = DOM.formGender.value;
  const courseVal = DOM.formCourse.value;
  const yearVal = DOM.formYearLevel.value;

  if (!idVal) {
    setFieldError('student_id', 'Student ID is required');
    valid = false;
  } else if (state.students && state.students.some(s => s.id !== state.editingStudentId && s.student_id && s.student_id.toLowerCase() === idVal.toLowerCase())) {
    setFieldError('student_id', 'This Student ID is already registered');
    valid = false;
  }

  if (!firstVal) {
    setFieldError('first_name', 'First name is required');
    valid = false;
  }

  if (!lastVal) {
    setFieldError('last_name', 'Last name is required');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    setFieldError('email', 'Please enter a valid email address');
    valid = false;
  } else if (state.students && state.students.some(s => s.id !== state.editingStudentId && s.email && s.email.toLowerCase() === emailVal.toLowerCase())) {
    setFieldError('email', 'This email address is already registered');
    valid = false;
  }

  if (!contactVal) {
    setFieldError('contact_number', 'Contact number is required');
    valid = false;
  }

  if (!genderVal) {
    setFieldError('gender', 'Please select gender');
    valid = false;
  }

  if (!courseVal) {
    setFieldError('course', 'Please select degree program');
    valid = false;
  }

  if (!yearVal) {
    setFieldError('year_level', 'Please select year level');
    valid = false;
  }

  if (!valid) {
    DOM.formErrorBanner.classList.remove('hidden');
    DOM.formErrorMessage.textContent = 'Please fill out all required fields marked with an asterisk (*).';
  } else {
    DOM.formErrorBanner.classList.add('hidden');
  }

  return valid;
}

function setFieldError(field, msg) {
  const errSpan = document.getElementById(`error_${field}`);
  if (errSpan) errSpan.textContent = msg;
  const inputEl = document.getElementById(`form${field.charAt(0).toUpperCase() + field.slice(1)}`);
  if (inputEl) inputEl.classList.add('is-invalid');
}

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
  DOM.formErrorBanner.classList.add('hidden');
}

function resetStudentForm() {
  DOM.studentForm.reset();
  DOM.formStudentDbId.value = '';
  clearFieldErrors();
}

/**
 * Generate a standard Student ID (e.g. 2024-XXXXX)
 */
function autoGenerateStudentId() {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  DOM.formStudentId.value = `${currentYear}-${randomNum}`;
  clearFieldErrors();
  showToast('info', 'ID Generated', `Assigned Student ID: ${DOM.formStudentId.value}`);
}

// Button loading state toggles
function setSaveBtnLoading(loading) {
  DOM.saveStudentSubmitBtn.disabled = loading;
  const icon = DOM.saveStudentSubmitBtn.querySelector('.btn-icon');
  if (loading) {
    DOM.saveSpinner.classList.remove('hidden');
    if (icon) icon.classList.add('hidden');
  } else {
    DOM.saveSpinner.classList.add('hidden');
    if (icon) icon.classList.remove('hidden');
  }
}

function setDeleteBtnLoading(loading) {
  DOM.confirmDeleteBtn.disabled = loading;
  if (loading) {
    DOM.deleteSpinner.classList.remove('hidden');
  } else {
    DOM.deleteSpinner.classList.add('hidden');
  }
}

// ==============================================================================
// SEARCH, FILTER & EXPORT
// ==============================================================================

function handleSearchInput(e) {
  const query = e.target.value;
  state.filters.search = query;

  if (query.trim().length > 0) {
    DOM.clearSearchBtn.classList.remove('hidden');
  } else {
    DOM.clearSearchBtn.classList.add('hidden');
  }

  // Debounce API requests for smooth typing
  clearTimeout(state.searchDebounceTimer);
  state.searchDebounceTimer = setTimeout(() => {
    updateActiveFilterPills();
    loadStudents();
  }, 300);
}

function clearSearch() {
  DOM.searchInput.value = '';
  state.filters.search = '';
  DOM.clearSearchBtn.classList.add('hidden');
  updateActiveFilterPills();
  loadStudents();
}

function handleFilterChange() {
  state.filters.course = DOM.filterCourse.value;
  state.filters.year_level = DOM.filterYearLevel.value;
  state.filters.status = DOM.filterStatus.value;
  state.filters.sort = DOM.sortOrder.value;

  updateActiveFilterPills();
  loadStudents();
}

function resetAllFilters() {
  DOM.searchInput.value = '';
  state.filters.search = '';
  DOM.clearSearchBtn.classList.add('hidden');

  DOM.filterCourse.value = 'All';
  DOM.filterYearLevel.value = 'All';
  DOM.filterStatus.value = 'All';
  DOM.sortOrder.value = 'date_desc';

  state.filters.course = 'All';
  state.filters.year_level = 'All';
  state.filters.status = 'All';
  state.filters.sort = 'date_desc';

  updateActiveFilterPills();
  loadStudents();
  showToast('info', 'Filters Reset', 'All search and dropdown filters have been cleared.');
}

/**
 * Export current view to CSV
 */
function exportStudentsToCSV() {
  if (state.students.length === 0) {
    showToast('warning', 'No Records', 'There are no student records to export.');
    return;
  }

  const headers = ['Student ID', 'First Name', 'Last Name', 'Email', 'Contact Number', 'Gender', 'Course', 'Year Level', 'Status', 'Date Registered'];
  
  const rows = state.students.map(s => [
    `"${s.student_id}"`,
    `"${s.first_name}"`,
    `"${s.last_name}"`,
    `"${s.email}"`,
    `"${s.contact_number}"`,
    `"${s.gender}"`,
    `"${s.course}"`,
    `"${s.year_level}"`,
    `"${s.status}"`,
    `"${new Date(s.created_at).toISOString()}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('success', 'CSV Exported', `Downloaded ${state.students.length} student records.`);
}

// ==============================================================================
// NAVIGATION & SECTION SWITCHING
// ==============================================================================
function switchSection(sectionId, linkElement) {
  // Update nav links active state
  DOM.navLinks.forEach(link => link.classList.remove('active'));
  if (linkElement) linkElement.classList.add('active');

  // Toggle sections
  DOM.overviewSection.classList.add('hidden');
  DOM.studentsSection.classList.add('hidden');
  DOM.analyticsSection.classList.add('hidden');

  if (sectionId === 'overview-section') {
    DOM.overviewSection.classList.remove('hidden');
    DOM.studentsSection.classList.remove('hidden'); // Show both on overview
    DOM.pageTitle.textContent = 'Dashboard Overview';
  } else if (sectionId === 'students-section') {
    DOM.studentsSection.classList.remove('hidden');
    DOM.pageTitle.textContent = 'Student Management';
  } else if (sectionId === 'analytics-section') {
    DOM.analyticsSection.classList.remove('hidden');
    DOM.pageTitle.textContent = 'Course & Program Analytics';
  }

  // Close mobile sidebar if open
  closeMobileSidebar();
}

function openMobileSidebar() {
  DOM.sidebar.classList.add('mobile-open');
  DOM.sidebarOverlay.classList.add('active');
}

function closeMobileSidebar() {
  DOM.sidebar.classList.remove('mobile-open');
  DOM.sidebarOverlay.classList.remove('active');
}

// ==============================================================================
// TOAST NOTIFICATIONS SYSTEM
// ==============================================================================
function showToast(type = 'info', title, message) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  switch (type) {
    case 'success':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      break;
    case 'error':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      break;
    case 'warning':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      break;
    default:
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close-btn" title="Dismiss">&times;</button>
  `;

  // Dismiss button
  toast.querySelector('.toast-close-btn').addEventListener('click', () => {
    dismissToast(toast);
  });

  DOM.toastContainer.appendChild(toast);

  // Auto-dismiss after 4.5 seconds
  setTimeout(() => {
    dismissToast(toast);
  }, 4500);
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains('toast-hiding')) return;
  toast.classList.add('toast-hiding');
  setTimeout(() => {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  }, 250);
}

// ==============================================================================
// HELPER UTILITIES
// ==============================================================================

function getInitials(first, last) {
  const f = first ? first.trim().charAt(0).toUpperCase() : '';
  const l = last ? last.trim().charAt(0).toUpperCase() : '';
  return `${f}${l}` || 'ST';
}

function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '--';

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return d.toLocaleDateString('en-US', options);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==============================================================================
// EVENT LISTENERS BINDINGS
// ==============================================================================
function setupEventListeners() {
  // Prevent background page scrolling while any modal is open
  const modalObserver = new MutationObserver(() => {
    const anyOpen = document.querySelectorAll('.modal-backdrop:not(.hidden)').length > 0;
    document.body.classList.toggle('modal-open', anyOpen);
  });
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });

    // Close when clicking directly on the backdrop (outside dialog)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (modal.id === 'studentFormModal') resetStudentForm();
      }
    });
  });

  // Close top modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-backdrop:not(.hidden)');
      if (openModal) {
        openModal.classList.add('hidden');
        if (openModal.id === 'studentFormModal') resetStudentForm();
      }
    }
  });

  // Mobile sidebar controls
  if (DOM.openSidebarBtn) DOM.openSidebarBtn.addEventListener('click', openMobileSidebar);
  if (DOM.closeSidebarBtn) DOM.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  if (DOM.sidebarOverlay) DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // Theme toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Refresh data
  DOM.refreshAllBtn.addEventListener('click', async () => {
    DOM.refreshAllBtn.style.transform = 'rotate(360deg)';
    DOM.refreshAllBtn.style.transition = 'transform 0.5s ease';
    await checkServerHealth();
    await loadDashboardData();
    showToast('success', 'Refreshed', 'Dashboard synced with Supabase.');
    setTimeout(() => {
      DOM.refreshAllBtn.style.transform = '';
      DOM.refreshAllBtn.style.transition = '';
    }, 500);
  });

  // Navigation Links
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute('data-section');
      switchSection(targetSection, link);
    });
  });

  DOM.viewAllStudentsLink.addEventListener('click', () => {
    switchSection('students-section', DOM.navStudents);
  });

  // Add Student Buttons
  DOM.headerAddStudentBtn.addEventListener('click', openAddStudentModal);
  if (DOM.openAddStudentModalBtn) DOM.openAddStudentModalBtn.addEventListener('click', openAddStudentModal);
  DOM.emptyAddBtn.addEventListener('click', openAddStudentModal);

  // Form Modal Controls
  DOM.closeFormModalBtn.addEventListener('click', () => {
    DOM.studentFormModal.classList.add('hidden');
    resetStudentForm();
  });
  DOM.cancelFormModalBtn.addEventListener('click', () => {
    DOM.studentFormModal.classList.add('hidden');
    resetStudentForm();
  });
  DOM.studentForm.addEventListener('submit', handleFormSubmit);
  DOM.autoGenerateIdBtn.addEventListener('click', autoGenerateStudentId);

  // View Modal Controls
  DOM.closeViewModalBtn.addEventListener('click', () => DOM.viewStudentModal.classList.add('hidden'));
  DOM.closeViewModalBtn2.addEventListener('click', () => DOM.viewStudentModal.classList.add('hidden'));

  // Delete Confirm Modal Controls
  DOM.cancelDeleteBtn.addEventListener('click', () => {
    DOM.deleteConfirmModal.classList.add('hidden');
    state.studentToDelete = null;
  });
  DOM.confirmDeleteBtn.addEventListener('click', executeDeleteStudent);

  // Filter & Search Controls
  DOM.searchInput.addEventListener('input', handleSearchInput);
  DOM.clearSearchBtn.addEventListener('click', clearSearch);
  DOM.filterCourse.addEventListener('change', handleFilterChange);
  DOM.filterYearLevel.addEventListener('change', handleFilterChange);
  DOM.filterStatus.addEventListener('change', handleFilterChange);
  DOM.sortOrder.addEventListener('change', handleFilterChange);
  DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
  DOM.emptyResetBtn.addEventListener('click', resetAllFilters);

  // Export CSV
  if (DOM.exportCsvBtn) DOM.exportCsvBtn.addEventListener('click', exportStudentsToCSV);

  // DB Config Modal Controls
  const openDbModal = () => {
    DOM.dbConfigModal.classList.remove('hidden');
    const banner = DOM.dbStatusModalBanner;
    if (state.serverConfig.configured) {
      banner.innerHTML = `<span style="color: var(--success); font-weight: 600;">✅ Supabase Connected:</span> <code>${state.serverConfig.supabaseUrl}</code>`;
    } else {
      banner.innerHTML = `<span style="color: var(--warning); font-weight: 600;">⚠️ Supabase Pending:</span> Configure <code>server/.env</code> to persist live records.`;
    }
  };

  if (DOM.navDbConfig) DOM.navDbConfig.addEventListener('click', openDbModal);
  if (DOM.dbHeaderPill) DOM.dbHeaderPill.addEventListener('click', openDbModal);
  DOM.bannerConfigGuideBtn.addEventListener('click', openDbModal);
  DOM.closeDbModalBtn.addEventListener('click', () => DOM.dbConfigModal.classList.add('hidden'));
  DOM.closeDbModalBtn2.addEventListener('click', () => DOM.dbConfigModal.classList.add('hidden'));

  // Test DB connection button
  DOM.testDbConnectionBtn.addEventListener('click', async () => {
    await checkServerHealth();
    await loadDashboardData();
    openDbModal(); // refresh text
    if (state.serverConfig.configured) {
      showToast('success', 'Connected', 'Supabase database is connected and responsive!');
    } else {
      showToast('warning', 'Connection Check', 'Supabase credentials are not yet configured in server/.env.');
    }
  });

  // Copy SQL Path
  DOM.copySqlPathBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    showToast('info', 'Copied', 'SQL schema path copied to clipboard: supabase/schema.sql');
  });

  // Logout Modal
  if (DOM.logoutBtn) {
    DOM.logoutBtn.addEventListener('click', () => {
      DOM.logoutModal.classList.remove('hidden');
    });
  }
  DOM.cancelLogoutBtn.addEventListener('click', () => {
    DOM.logoutModal.classList.add('hidden');
  });
  DOM.confirmLogoutBtn.addEventListener('click', () => {
    DOM.logoutModal.classList.add('hidden');
    showToast('info', 'Logged Out', 'Administrator session ended. Refresh page to log back in.');
  });

  // Close modals when clicking on background backdrop
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.add('hidden');
    }
  });

  // Keyboard escape key to close open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(modal => {
        modal.classList.add('hidden');
      });
      closeMobileSidebar();
    }
  });
}
