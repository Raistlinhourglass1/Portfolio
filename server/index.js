const path = require('path');
const express = require('express');

const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');
const resumeRouter = require('./routes/resume');
const aboutRouter = require('./routes/about');
const adminRouter = require('./routes/admin');
const visitLogger = require('./middleware/visit-logger');
const { getTechIcon, getIconBySlug } = require('./data/tech-icons');

const app = express();
const PORT = process.env.PORT || 3000;

// Behind Caddy (one reverse-proxy hop) in production — without this req.ip is
// the proxy's address, not the visitor's, and the visit log / GeoIP would be
// useless. Override with TRUST_PROXY (hop count, or a comma-separated subnet
// list) if the deployment fronts the app with more than one proxy.
const trustProxy = process.env.TRUST_PROXY || '1';
app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Available in every view without each route passing it explicitly.
app.locals.getTechIcon = getTechIcon;
app.locals.getIconBySlug = getIconBySlug;

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Record page visits to the analytics DB. After express.static so asset
// requests (handled above) aren't logged; before the routes so its
// res.on('finish') handler is always registered.
app.use(visitLogger);

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
app.use('/admin', adminRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
