const router = require('express').Router();
const passport = require('passport');
var bodyParser = require('body-parser');
var dbs = require('../config/db.js');
var pool = dbs.getPool();

// auth login to return the logining page
router.get('/login', (req, res) => {
  req.session.user = req.user;
    res.render('login', { user: req.user });
});

// auth logout to return the logout page
router.get('/logout', (req, res) => {
  req.logout();
res.redirect('/');
});

router.get('/meeting', (req, res) => {
res.redirect('http://localhost:3000/meeting');
});

// auth github to call github to authoticate
router.get('/github', passport.authenticate('github', {
     scope:['profile']
}));

//auth verif to return the verification page
router.get('/verif', function(req, res, next) {
  res.render('verif',{ user: req.user })
});

router.get('/verifAgain', function(req, res, next) {
  res.render('verifAgain',{ user: req.user })
});
//get slots data
router.post('/sloted', function(req, res, next) {
  pool.connect((error, db, done2)=>{
  if(error){
    return console.log(error);
  }
  // db.query('INSERT INTO slots (start_timestamp,note) VALUES ($1, $2) RETURNING *',
  // [req.body.start_timestamp,req.body.note]

    else{
      console.info('doing stuff')
      db.query(`UPDATE slots
        SET start_timestamp=$1, note=$2
        WHERE user_id=71;`,
        [req.body.user_availability[0].start_timestamp,req.body.note],(error, insertProfile)=>{
            if(error){
              return console.log(error);
            } else {
              console.log("am the")
            }
            //done(null,insertProfile.rows[0]);
          })
        }
    })
  res.redirect('http://localhost:3000/');
});

//auth verif to capture what the user verification code
router.post('/verif', function(req, res) {
  var verifCode =req.body.id;// storing the user verification code in variable
console.log('this the number',verifCode)
  //connecting to database to check verification_codes table with user input
  pool.connect((error, db, done)=>{
    if(error){
      return console.log(error);
    }
    else {
      db.query('SELECT * FROM verification_codes WHERE code = $1',[verifCode],(error, user)=>{
        done();
        if(error){
          return console.log(error);
        }
    //updating the user table with user verification code
        else {
          if (!user.rowCount){
            res.redirect('/auth/verifAgain');
          }
          else{
              console.log(user.rows[0])
              console.log('yesyes',req.user.user_id);
                var user_id = req.user.user_id;
                var studentValue = user.rows[0].role_student;
                var mentorValue = user.rows[0].role_mentor;
                var organiserValue = user.rows[0].role_organiser;

          db.query(`UPDATE users
            SET role_student=$1, role_mentor=$2, role_organiser=$3
            WHERE user_id=$4;`,
            [studentValue,mentorValue,organiserValue,req.user.user_id])
            done();
            if(error){
              return console.log('am the ',error);
            }
            else {
              db.query('INSERT INTO slots (user_id) VALUES ($1) RETURNING *',
              [user_id] ,(error, insertProfile)=>{
                if(error){
                  return console.log(error);
                }
                else{
                      res.redirect('http://localhost:3000/dashboard');
            }
          })
        };

};
};
});
};
});
});

//handling the call back redirect from github
router.get('/github/redirect', passport.authenticate('github',{ failureRedirect: '/login',successRedirect:'http://localhost:3000/activation' }), (req, res) => {
    res.send(req.user);
});

module.exports = router;
