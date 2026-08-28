const path = require('path');
const express = require('express');

const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');
const resumeRouter = require('./routes/resume');
const aboutRouter = require('./routes/about');
const { getTechIcon } = require('./data/tech-icons');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Available in every view without each route passing it explicitly.
app.locals.getTechIcon = getTechIcon;

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Make the current path available to all views (for nav active-state, etc.)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/resume', resumeRouter);
app.use('/about', aboutRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
