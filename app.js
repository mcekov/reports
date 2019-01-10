const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverrride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

// app init
const app = express();

// Connect to db
mongoose
  .connect(
    'mongodb://localhost:27017/reports',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDb Connected'))
  .catch(err => console.log(err));

// Load Report model
require('./models/Report');
const Report = mongoose.model('reports');

// Handlebars middleware
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-override middleware
app.use(methodOverrride('_method'));

// Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

// Global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Home page
app.get('/', (req, res) => {
  res.render('home');
});

// Add Report
app.get('/add', (req, res) => {
  res.render('reports/add');
});

// HowTo page
app.get('/howto', (req, res) => {
  res.render('howto');
});

// All Reports page
app.get('/all', (req, res) => {
  Report.find({})
    .sort({ date: 'desc' })
    .then(reports => {
      // TODO Add var counter to count reports
      res.render('reports/all', { reports: reports });
    });
});

// Single report page
app.get('/report/:id', (req, res) => {
  Report.findOne({
    _id: req.params.id
  }).then(report => {
    res.render('reports/single', { report: report });
  });
});

// Edit Report
// TODO Add support for radio butons to work with edit form
app.get('/reports/edit/:id', (req, res) => {
  Report.findOne({
    _id: req.params.id
  }).then(report => {
    res.render('reports/edit', { report: report });
  });
});

// Add Process Form
app.post('/reports', (req, res) => {
  const newUser = {
    model: req.body.model,
    sn: req.body.sn,
    warranty: req.body.warranty,
    defect: req.body.defectText,
    parts: req.body.partsText,
    client: req.body.client,
    reportDate: req.body.reportDate,
    endReqDate: req.body.endDate,
    notes: req.body.notes
  };
  //console.log(newUser);
  new Report(newUser).save().then(report => {
    req.flash('success_msg', 'Заявката е добавена');
    res.redirect('/all');
  });
});

// Edit form process PUT
app.put('/reports/:id', (req, res) => {
  Report.findOne({
    _id: req.params.id
  }).then(report => {
    report.model = req.body.model;
    report.sn = req.body.sn;
    report.warranty = req.body.warranty;
    report.defect = req.body.defectText;
    report.parts = req.body.partsText;
    report.client = req.body.clientName;
    report.reportDate = req.body.reportDateNew;
    report.endDate = req.body.endDate;
    report.notes = req.body.notes;

    report.save().then(report => {
      req.flash('success_msg', 'Заявката е редактирана');
      res.redirect('/all');
    });
  });
});

// Dellete report
app.delete('/reports/:id', (req, res) => {
  Report.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Заявката е премахната');
    res.redirect('/all');
  });
});

// Server start
const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
