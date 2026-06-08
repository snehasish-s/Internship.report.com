const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const Doubt = require('../models/Doubt');

// GET & POST /api/seed — seed database with realistic data analytics content
const seedHandler = async (req, res) => {
  try {
    // Check if already seeded
    const existingAdmin = await User.findOne({ email: 'anilkumarpalata@admin.com' });
    if (existingAdmin) {
      return res.json({ message: 'Database already seeded.', status: 'skipped' });
    }


    // Clear existing data
    await Doubt.deleteMany({});
    await Session.deleteMany({});
    await User.deleteMany({});

    // --- Create Admin ---
    const admin = new User({
      name: 'Anil Kumar Palata',
      email: 'anilkumarpalata@admin.com',
      passwordHash: 'admin@123',
      role: 'admin',
      batch: null
    });
    await admin.save();

    // --- Create Students ---
    const studentsData = [
      { name: 'Tekaram Mahananda', email: '2301320217@student.com', batch: 'DATA ANALYTICS - A' },
      { name: 'Pappu Meher', email: '2301320135@student.com', batch: 'DATA ANALYTICS - A' },
      { name: 'Gouri Shankar Nayak', email: '2301320091@student.com', batch: 'DATA ANALYTICS - B' },
      { name: 'Paban Kumar Sahoo', email: '2301320133@student.com', batch: 'DATA ANALYTICS - B' },
      { name: 'Swetalina Parida', email: '2301320215@student.com', batch: 'DATA ANALYTICS - C' },
      { name: 'Chiranjib Parida', email: '2301320075@student.com', batch: 'DATA ANALYTICS - A' },
      { name: 'Binayak Padhiary', email: '2505320003@student.com', batch: 'DATA ANALYTICS - MCA' },
      { name: 'Omm Snehasish Parida', email: '2301320132@student.com', batch: 'DATA ANALYTICS - B' },
      { name: 'Kuna Debaraj', email: '2301320109@student.com', batch: 'DATA ANALYTICS - B' },
      { name: 'Dibyajyoti Parida', email: '2301320082@student.com', batch: 'DATA ANALYTICS - B' }
    ];

    const students = [];
    for (const data of studentsData) {
      const student = new User({
        name: data.name,
        email: data.email,
        passwordHash: 'password123',
        role: 'student',
        batch: data.batch
      });
      await student.save();
      students.push(student);
    }

    // --- Create Sample Sessions ---
    const sessionsData = [
      // Tekaram Mahananda (students[0])
      {
        studentIdx: 0,
        date: new Date('2025-06-01'),
        topic: 'Introduction to Pandas DataFrames',
        toolsUsed: ['Python', 'Jupyter', 'Pandas'],
        learnings: 'Learned how to create DataFrames from dictionaries and CSV files, basic indexing with .loc and .iloc, and data type inspection using .dtypes and .info().',
        type: 'Hands-on Lab',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 4,
        datasetUsed: 'Iris Dataset'
      },
      {
        studentIdx: 0,
        date: new Date('2025-06-03'),
        topic: 'Data Cleaning with Pandas',
        toolsUsed: ['Python', 'Pandas', 'NumPy'],
        learnings: 'Handled missing values using fillna(), dropna(), and interpolation. Learned to detect and remove duplicates, and standardize column names.',
        type: 'Hands-on Lab',
        durationHours: 2.5,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 3,
        datasetUsed: 'Titanic Dataset'
      },
      // Pappu Meher (students[1])
      {
        studentIdx: 1,
        date: new Date('2025-06-02'),
        topic: 'SQL Basics — SELECT, WHERE, JOIN',
        toolsUsed: ['SQL', 'MySQL'],
        learnings: 'Practiced writing SELECT queries with WHERE clauses, INNER JOIN and LEFT JOIN across multiple tables. Understood primary and foreign keys.',
        type: 'Lecture',
        durationHours: 1.5,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 3,
        datasetUsed: 'Northwind Database'
      },
      {
        studentIdx: 1,
        date: new Date('2025-06-05'),
        topic: 'SQL Aggregations — GROUP BY, HAVING',
        toolsUsed: ['SQL', 'MySQL'],
        learnings: 'Learned aggregate functions COUNT, SUM, AVG, MAX, MIN with GROUP BY. Used HAVING to filter grouped results. Built multi-level aggregation queries.',
        type: 'Hands-on Lab',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 4,
        datasetUsed: 'Northwind Database'
      },
      // Gouri Shankar Nayak (students[2])
      {
        studentIdx: 2,
        date: new Date('2025-06-01'),
        topic: 'Exploratory Data Analysis with Python',
        toolsUsed: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
        learnings: 'Performed EDA on a real-world dataset: computed summary statistics, created distribution plots, correlation heatmaps, and identified outliers using box plots.',
        type: 'Hands-on Lab',
        durationHours: 3,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 4,
        datasetUsed: 'House Prices Dataset'
      },
      // Paban Kumar Sahoo (students[3])
      {
        studentIdx: 3,
        date: new Date('2025-06-02'),
        topic: 'Power BI — Data Import & Modeling',
        toolsUsed: ['Power BI', 'Excel'],
        learnings: 'Imported data from Excel into Power BI, created relationships between tables, learned star schema design. Created calculated columns using DAX.',
        type: 'Tool Workshop',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 3,
        datasetUsed: 'Sales Dataset'
      },
      {
        studentIdx: 3,
        date: new Date('2025-06-06'),
        topic: 'Power BI — Interactive Dashboards',
        toolsUsed: ['Power BI'],
        learnings: 'Built an interactive sales dashboard with slicers, drill-through pages, and KPI cards. Applied conditional formatting and custom visuals.',
        type: 'Project Review',
        durationHours: 2.5,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 4,
        datasetUsed: 'Sales Dataset'
      },
      // Swetalina Parida (students[4])
      {
        studentIdx: 4,
        date: new Date('2025-06-03'),
        topic: 'Statistics — Descriptive Statistics & Probability',
        toolsUsed: ['Python', 'NumPy', 'Jupyter'],
        learnings: 'Calculated mean, median, mode, variance, and standard deviation. Understood normal distribution, z-scores, and probability basics.',
        type: 'Lecture',
        durationHours: 1.5,
        mentor: 'Prof. Anil Kumar',
        rating: 3,
        confidenceLevel: 2,
        datasetUsed: null
      },
      // Chiranjib Parida (students[5])
      {
        studentIdx: 5,
        date: new Date('2025-06-04'),
        topic: 'Data Visualization with Matplotlib',
        toolsUsed: ['Python', 'Matplotlib', 'Jupyter'],
        learnings: 'Created line plots, bar charts, scatter plots, and pie charts. Customized axes, titles, legends, and color maps. Learned subplot grids.',
        type: 'Hands-on Lab',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 4,
        datasetUsed: 'COVID-19 Dataset'
      },
      {
        studentIdx: 5,
        date: new Date('2025-06-07'),
        topic: 'Seaborn for Statistical Visualization',
        toolsUsed: ['Python', 'Seaborn', 'Pandas', 'Jupyter'],
        learnings: 'Used Seaborn for heatmaps, pair plots, violin plots, and categorical plots. Compared Seaborn styling with raw Matplotlib.',
        type: 'Hands-on Lab',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 4,
        datasetUsed: 'Tips Dataset'
      },
      // Binayak Padhiary (students[6])
      {
        studentIdx: 6,
        date: new Date('2025-06-02'),
        topic: 'Excel for Data Analytics — Pivot Tables & VLOOKUP',
        toolsUsed: ['Excel'],
        learnings: 'Created pivot tables for summarizing sales data, used VLOOKUP and INDEX-MATCH for data lookups. Built dynamic charts linked to pivot tables.',
        type: 'Tool Workshop',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 4,
        datasetUsed: 'Superstore Dataset'
      },
      // Omm Snehasish Parida (students[7])
      {
        studentIdx: 7,
        date: new Date('2025-06-04'),
        topic: 'Machine Learning Basics — Linear Regression',
        toolsUsed: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter'],
        learnings: 'Understood supervised vs unsupervised learning. Implemented linear regression, split data into train/test sets, evaluated with MSE and R-squared.',
        type: 'Lecture',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 3,
        datasetUsed: 'Boston Housing Dataset'
      },
      {
        studentIdx: 7,
        date: new Date('2025-06-06'),
        topic: 'Feature Engineering & Model Evaluation',
        toolsUsed: ['Python', 'Scikit-learn', 'Pandas'],
        learnings: 'Learned feature scaling (StandardScaler, MinMaxScaler), one-hot encoding for categorical variables. Evaluated models with confusion matrix, accuracy, precision, recall.',
        type: 'Mentor Session',
        durationHours: 1.5,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 3,
        datasetUsed: 'Titanic Dataset'
      },
      // Kuna Debaraj (students[8])
      {
        studentIdx: 8,
        date: new Date('2025-06-03'),
        topic: 'Tableau — Connecting Data Sources',
        toolsUsed: ['Tableau'],
        learnings: 'Connected Tableau to CSV and Excel data. Created calculated fields, built bar charts and treemaps. Learned the difference between dimensions and measures.',
        type: 'Tool Workshop',
        durationHours: 2,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 3,
        datasetUsed: 'Superstore Dataset'
      },
      // Dibyajyoti Parida (students[9])
      {
        studentIdx: 9,
        date: new Date('2025-06-05'),
        topic: 'NumPy Arrays & Vectorized Operations',
        toolsUsed: ['Python', 'NumPy', 'Jupyter'],
        learnings: 'Learned ndarray creation, reshaping, slicing. Understood broadcasting rules and performed vectorized math operations. Compared performance with Python lists.',
        type: 'Hands-on Lab',
        durationHours: 1.5,
        mentor: 'Prof. Anil Kumar',
        rating: 4,
        confidenceLevel: 4,
        datasetUsed: null
      },
      {
        studentIdx: 9,
        date: new Date('2025-06-07'),
        topic: 'Storytelling with Data — Best Practices',
        toolsUsed: ['Power BI', 'Excel'],
        learnings: 'Studied data storytelling principles: audience awareness, chart selection framework, decluttering visuals, using annotations and narrative flow in dashboards.',
        type: 'Mentor Session',
        durationHours: 1,
        mentor: 'Prof. Anil Kumar',
        rating: 5,
        confidenceLevel: 4,
        datasetUsed: null
      }
    ];

    const sessions = [];
    for (const data of sessionsData) {
      const session = new Session({
        userId: students[data.studentIdx]._id,
        date: data.date,
        topic: data.topic,
        toolsUsed: data.toolsUsed,
        learnings: data.learnings,
        type: data.type,
        durationHours: data.durationHours,
        mentor: data.mentor,
        rating: data.rating,
        confidenceLevel: data.confidenceLevel,
        datasetUsed: data.datasetUsed
      });
      await session.save();
      sessions.push(session);
    }

    // --- Create Sample Doubts ---
    const doubtsData = [
      {
        sessionIdx: 0,  // Pandas DataFrames - Tekaram
        studentIdx: 0,
        question: 'What is the difference between .loc and .iloc in Pandas? When should I use which?',
        answer: '.loc is label-based indexing (uses row/column names), while .iloc is integer position-based (uses numeric index). Use .loc when you know the label, .iloc when you know the position.',
        resolved: true
      },
      {
        sessionIdx: 1,  // Data Cleaning - Tekaram
        studentIdx: 0,
        question: 'When should I use fillna() vs dropna() for handling missing values?',
        answer: null,
        resolved: false
      },
      {
        sessionIdx: 2,  // SQL Basics - Pappu
        studentIdx: 1,
        question: 'What is the difference between INNER JOIN and LEFT JOIN? When would a LEFT JOIN return NULLs?',
        answer: 'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table and matching rows from the right — NULLs appear when there is no match in the right table.',
        resolved: true
      },
      {
        sessionIdx: 4,  // EDA - Gouri
        studentIdx: 2,
        question: 'How do I decide whether to remove outliers or keep them in analysis?',
        answer: null,
        resolved: false
      },
      {
        sessionIdx: 7,  // Statistics - Swetalina
        studentIdx: 4,
        question: 'When should I use median instead of mean for central tendency?',
        answer: 'Use median when data is skewed or has outliers, as it is robust to extreme values. Mean is better for normally distributed data without significant outliers.',
        resolved: true
      },
      {
        sessionIdx: 11,  // ML Basics - Omm
        studentIdx: 7,
        question: 'How do I know if my model is overfitting vs underfitting?',
        answer: null,
        resolved: false
      },
      {
        sessionIdx: 12,  // Feature Engineering - Omm
        studentIdx: 7,
        question: 'When should I use StandardScaler vs MinMaxScaler for feature scaling?',
        answer: 'StandardScaler when data follows Gaussian distribution. MinMaxScaler when you need bounded [0,1] range or for algorithms sensitive to magnitude like neural networks.',
        resolved: true
      },
      {
        sessionIdx: 14,  // NumPy - Dibyajyoti
        studentIdx: 9,
        question: 'What exactly is broadcasting in NumPy and when does it fail?',
        answer: null,
        resolved: false
      }
    ];

    for (const data of doubtsData) {
      const doubt = new Doubt({
        sessionId: sessions[data.sessionIdx]._id,
        studentId: students[data.studentIdx]._id,
        question: data.question,
        answer: data.answer,
        resolved: data.resolved
      });
      await doubt.save();
    }

    res.json({
      message: 'Database seeded successfully!',
      data: {
        admin: { email: 'anilkumarpalata@admin.com', password: 'admin@123' },
        studentPassword: 'password123',
        studentsCreated: studentsData.length,
        sessionsCreated: sessionsData.length,
        doubtsCreated: doubtsData.length,
        studentEmails: studentsData.map(s => s.email)
      }
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Error seeding database.', error: err.message });
  }
};

router.get('/', seedHandler);
router.post('/', seedHandler);


// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
