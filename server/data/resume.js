// Single source of truth for resume content — feeds both the HTML resume
// page (server/views/resume.ejs) and, later, PDF generation, so the two
// never drift out of sync. Edit this file to update either output.

module.exports = {
  name: 'Justin Hendrix',
  contact: {
    phone: '832-908-2877',
    email: 'Hendrixjustin908@gmail.com',
    linkedin: { label: 'linkedin.com/in/justinhendrix908', url: 'https://linkedin.com/in/justinhendrix908' },
    github: { label: 'github.com/Raistlinhourglass1', url: 'https://github.com/Raistlinhourglass1' },
  },

  education: [
    {
      school: 'University of Houston',
      location: 'Houston, TX',
      degree: 'Bachelor of Science in Computer Science, Minor in Cybersecurity',
      dates: 'December 2024 – December 2026',
    },
    {
      school: 'Lone Star College',
      location: 'Kingwood, TX',
      degree: "Associate's in Computer Science",
      dates: 'May 2022 – May 2024',
    },
  ],

  experience: [
    {
      title: 'Computer Science Tutor',
      org: 'ACM Kingwood',
      location: 'Kingwood, TX',
      dates: 'May 2023 – May 2024',
      bullets: [
        'Tutored students in core computer science courses, including Data Structures, Computer Architecture, and C++ Fundamentals',
        'Provided one-on-one and group sessions to reinforce course concepts, assist with programming assignments, and prepare students for exams',
        'Created and explained practice problems to enhance student problem-solving skills and strengthen understanding of key topics',
      ],
    },
    {
      title: 'Coordinator and Project Manager, ACM Kingwood',
      org: 'ACM Kingwood',
      location: 'Kingwood, TX',
      dates: 'May 2022 – May 2024',
      bullets: [
        'Led a team of four to win a 3D game development competition using Unity, overseeing design, coding, and testing phases',
        'Managed club scheduling, including planning weekly meetings, coordinating special events, and ensuring smooth execution of activities',
        'Developed and delivered keynote speeches on cybersecurity topics, engaging audiences and representing the ACM branch at events',
      ],
    },
    {
      title: 'Pharmacy Technician',
      org: 'Walmart Pharmacy',
      location: 'Humble, TX',
      dates: 'June 2022 – Present',
      bullets: [
        'Maintained inventory accuracy across 1,200+ medications, ensuring optimal stock levels through audits',
        'Processed an average of 250–300 patient transactions per day, maintaining accuracy and patient confidentiality',
        'Led a project that achieved a 30% increase in patient satisfaction scores over 1 year',
      ],
    },
  ],

  // Resume-specific project entries — distinct from the portfolio's
  // showcase `projects` table (server/db). Kept separate on purpose: this
  // list mirrors the formal resume record, the portfolio table is the
  // curated case-study content for the /projects pages.
  projects: [
    {
      title: "Lead Developer, Ashlar's Abyss",
      tech: 'C#, JavaScript, ShaderLab, HTML',
      dates: 'April 2024',
      bullets: [
        'Collaborated with a team of four to design and develop a 3D game centered around exploring a labyrinth of old industrial technology',
        'Created a demo map set within a cave environment, featuring personally modeled AI enemies with custom attack behaviors',
        'Developed a combat system and a procedural animation system that was universally applied to all characters, enhancing fluidity and realism',
        'Delivered a live presentation and gameplay demonstration to a crowd, resulting in winning the competition',
      ],
    },
    {
      title: 'Library Database Website',
      tech: 'JavaScript, Node.js, HTML, MySQL, Git, React',
      dates: 'August 2025 – October 2025',
      bullets: [
        'Collaborated with a team of four to design and implement a relational database system linked to a web interface',
        'Developed the application using React for the front end, Node.js for the back end, and MySQL for data storage and management',
        'Integrated a barcode reader for real-time item lookup and transaction processing, enhancing system efficiency and usability',
      ],
    },
  ],

  skills: {
    Languages: ['Java', 'Python', 'C/C++', 'SQL (Postgres)', 'JavaScript', 'HTML/CSS', 'R'],
    Frameworks: ['React', 'Node.js', 'Flask', 'JUnit', 'WordPress', 'Material-UI', 'FastAPI'],
    'Developer Tools': ['Git', 'Docker', 'VS Code', 'Visual Studio', 'Eclipse'],
    Libraries: ['pandas', 'NumPy', 'Matplotlib'],
  },
};
