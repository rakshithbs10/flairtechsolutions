// config/database.js
const sql = require('mssql');

const dbConfig = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  port: parseInt(process.env.AZURE_SQL_PORT || '1433'),
  options: {
    encrypt: true,          // Required for Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log('✅ Connected to Azure SQL Database');
  }
  return pool;
}

async function initializeDatabase() {
  const pool = await getPool();

  // Create tables if they don't exist
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
    CREATE TABLE Users (
      id INT IDENTITY(1,1) PRIMARY KEY,
      fullName NVARCHAR(255) NOT NULL,
      email NVARCHAR(255) NOT NULL UNIQUE,
      passwordHash NVARCHAR(255) NOT NULL,
      phone NVARCHAR(50),
      createdAt DATETIME DEFAULT GETDATE(),
      updatedAt DATETIME DEFAULT GETDATE()
    )
  `);
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='JobListings' AND xtype='U')
    CREATE TABLE JobListings (
      id INT IDENTITY(1,1) PRIMARY KEY,
      title NVARCHAR(255) NOT NULL,
      description NVARCHAR(MAX) NOT NULL,
      location NVARCHAR(255) NOT NULL,
      jobType NVARCHAR(100) NOT NULL,
      requirements NVARCHAR(MAX),
      salary NVARCHAR(100),
      postedDate DATETIME DEFAULT GETDATE(),
      isActive BIT DEFAULT 1,
      createdAt DATETIME DEFAULT GETDATE(),
      updatedAt DATETIME DEFAULT GETDATE()
    )
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Applications' AND xtype='U')
    CREATE TABLE Applications (
      id INT IDENTITY(1,1) PRIMARY KEY,
      userId INT,
      jobId INT,
      fullName NVARCHAR(255) NOT NULL,
      email NVARCHAR(255) NOT NULL,
      phone NVARCHAR(50),
      jobTitle NVARCHAR(255),
      resumeUrl NVARCHAR(500),
      resumeFileName NVARCHAR(255),
      coverLetter NVARCHAR(MAX),
      status NVARCHAR(50) DEFAULT 'pending',
      appliedDate DATETIME DEFAULT GETDATE(),
      createdAt DATETIME DEFAULT GETDATE(),
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL,
      FOREIGN KEY (jobId) REFERENCES JobListings(id) ON DELETE SET NULL
    )
  `);

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ContactMessages' AND xtype='U')
    CREATE TABLE ContactMessages (
      id INT IDENTITY(1,1) PRIMARY KEY,
      fullName NVARCHAR(255) NOT NULL,
      email NVARCHAR(255) NOT NULL,
      phone NVARCHAR(50),
      subject NVARCHAR(255),
      message NVARCHAR(MAX) NOT NULL,
      isRead BIT DEFAULT 0,
      createdAt DATETIME DEFAULT GETDATE()
    )
  `);

  // Seed initial job listings if empty
  const result = await pool.request().query('SELECT COUNT(*) as count FROM JobListings');
  if (result.recordset[0].count === 0) {
    await pool.request().query(`
      INSERT INTO JobListings (title, description, location, jobType, requirements, salary) VALUES
      (
        'Systems Analyst',
        'Assess Needs, determine system requirements, create, develop, & implement IT Solutions. No travel required but relocation to unanticipated locations throughout the U.S may be necessary.',
        'Redmond, WA',
        'Full-time',
        'Masters or equivalent in CS/IT or related field',
        NULL
      ),
      (
        'Senior .NET Developer',
        'The position involves developing, creating and modifying applications. Job based on Redmond, WA. No travel required but relocation to unanticipated locations throughout the U.S. may be necessary.',
        'Redmond, WA',
        'Full-time',
        'Masters Degree or equivalent in Computer Science, Applied Computer Science, Computer Engineering, Computer Applications, Information Systems, Information Technology, or a related field of study.',
        NULL
      ),
      (
        'Software Engineer',
        'The position involves developing, creating & modifying applications. Requires experience with Visual Studio, SQL Server, C#, ASP.NET, MVC, ASP.NET Core, Web API, RESTful API, XML, JavaScript, Angular, Postman, GIT, Bitbucket, & Azure DevOps. Must have experience in designing, developing, implementing, & testing applications.',
        'Redmond, WA',
        'Full-time',
        'Software Engineer (Masters w/ 3 yrs or Bach w/ 5 yrs exp; Major: CIS, CS, or equiv.)',
        '$168,709.00/year'
      )
    `);
    console.log('✅ Seeded initial job listings');
  }

  console.log('✅ Database tables initialized');
}

module.exports = { getPool, initializeDatabase, sql };
