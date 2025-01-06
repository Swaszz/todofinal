const express = require('express')
const app = express()

const dotenv = require ("dotenv")
dotenv.config( './.env');
const dbpassword = process.env.DB_password
console.log(dbpassword)


const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://swathykrishna2227:${dbpassword}@main.07fp5.mongodb.net/?retryWrites=true&w=majority&appName=main`)
   .then(() => {
       console.log("Database connection successful");
   })
   .catch((err) => {
       console.error("Database connection failed"); 
   });

   const TaskSchema = new mongoose.Schema({
    task: { type: String },
    isCompleted: { type: Boolean }
  });
  const Task = mongoose.model('task', TaskSchema);

var cors = require('cors')
app.use(cors({
    origin: 'http://localhost:5173',
  }))

  app.use(express.json());

let tasks=[{
    _id: 1,
    task: "Go to shop",
  },
  {
    _id: 2,
    task: "Buy Tomato",
  },
  {
    _id: 3,
    task: "Buy potato",
  },
  {
    _id: 4,
    task: "pay",
  },

]

app.get('/', (req, res) => {
  Task.find()
  .then(taskItems=>{
console.log(taskItems)
res.json({taskItems})
  })
  .catch(err=>{

  })
   
  })

  app.post('/', (req, res) => {
   console.log(req.body)
   const task= req.body.task
   Task.create({task:task})
   res.send("sucess")
  })
/*
  app.put('/task/:index', (req, res) => { 
    const index = req.params.index; 
    const updatedTask = req.body.task; 
    tasks[index].task = updatedTask; 
    res.send("updated"); 
});
*/


app.put('/task/:id', async (req, res) => { 
    const { id } = req.params;
    const updatedTask = req.body.task;
    
    try {
        await Task.findByIdAndUpdate(id, { task: updatedTask });
        res.send("updated"); 
    } catch (error) {
        res.status(500).send("Error updating task");
    }
});




app.delete('/task/:id', (req,res)=>{
 Task.findByIdAndDelete(req.params.id)
 .then(data =>{
  if(data){
    res.send("Deleted")
  }else{
    res.status(404).json({"message" : "Task does not exist"})
  }
 }).catch(err=>{
  res.status(400).json({"message" : "something went wrong"})
 })
})
 

  app.listen(3000, () => { console.log('Server is running on port 3000') });