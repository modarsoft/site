// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./views', {index: 'index.html'}))
app.use(bodyParser.json());
const port =process.port || 3000;





let db=new sqlite3.Database('./mydb.db',(err)=>{
  if(err)
  {
     console.error(err.message);
  }
   console.log('connected')
});

db.run('create table if not exists users(id integer primary key autoincrement , first text ,last text, email text,mobile text , adress text ) ' ,(err)=>{
  if(err)
  {
    console.error(err.message)
  }
  console.log('table created')
})
app.post('/submit-form', (req, res) => { 
  const { first,last, email,mobile,adress } = req.body;
   db.run(`INSERT INTO users (first,last, email,mobile,adress) VALUES (?, ?,?,?,?)`, [first,last, email,mobile,adress], function(err) { 
    if (err)
       { return console.error(err.message); 

       } 
       res.render('index.html');
       });
   });
  
app.get('/show',(req,res)=>{
  db.all('select * from users',[],(err,rows)=>{
    if(err){
      throw err
    }
   
    res.render('show.html', { info: rows });
  })
})
app.post('/delete' ,(req,res)=>{
const id=req.body.id
db.run('delete from users where id=?',id,(err)=>{
if(err)
{
  return res.status(500).send('Error deleting row');
}
db.all('select * from users',[],(err,rows)=>{
  if(err){
    throw err
  }
 
  res.render('show.html', { info: rows });
})
})
})
app.listen(port, () => { 
  console.log(`Server running on port ${port}`);
 });