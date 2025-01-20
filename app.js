const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Customer = require("./models/customerSchema")
// إعداد المنفذ
const port = 7000;

// إعداد محرك العرض
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// Middleware
app.use(express.json());
var moment = require('moment')

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

// الاتصال بقاعدة البيانات
const dbURI = 'mongodb://admin:admin@localhost:27017/todo?authSource=admin';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('❌ Connection Error:', error.message);
});

db.once('open', () => {
  console.log('✅ Connected to DB!');
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});



// المسار الأساسي
app.get('/', (req, res) => {
  console.log("====================================");
  Customer.find()
    .then((result) => {
      console.log(result); // Log the fetched data for debugging
      res.render("index", { arr: result, moment: moment }); // Pass the data to the view
    })
    .catch((err) => {
      console.error("Error fetching customers:", err); // Log errors properly

    });
});






app.get('/user/add.html', (req, res) => {
  res.render("user/add");
});


//updet edit
app.get("/edit/:id", (req, res) => {
  Customer.findById(req.params.id).then((result) => {
    res.render("user/edit", { obj: result, moment: moment });
  }).catch((err) => {
    console.log(err);
  });



});



//get 
app.get("/user/:id", (req, res) => {


  // result ==> object
  Customer.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });


});








//post add
app.post('/user/add.html', (req, res) => {
  console.log(req.body)
  Customer.create(req.body)
    .then(() => {
      res.redirect("/")
    })
    .catch((err) => {
      console.log(err);
    });
});


app.post('/search', (req, res) => {
  console.log(req.body.searchText)
  Customer.find({ fireName: req.body.searchText })
  .then((result) => {
    res.render("user/search",{ arr: result, moment: moment })
  })
  .catch((err) => {
    console.log(err);
  });
});










//put
app.put('/edit/:id', (req, res) => {
  Customer.updateOne({ _id: req.params.id }, req.body)
    .then((params) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});




//delet 
app.delete('/delete/:id', (req, res) => {
  Customer.deleteOne({ _id: req.params.id }) // استخدم deleteOne بدلاً من deleteOneOne
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});
