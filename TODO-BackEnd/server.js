const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())


// sample in-memory storage for todo
// let todos = [];

// connect mongodb
mongoose.connect('mongodb://localhost:27017/mern-app-todo')
.then(() => {
    console.log('Db connected');
})
.catch((err) => {
    console.log(err);
})

// create schema
const todoschema = new mongoose.Schema({
    title : {
        required: true,
        type: String
    },
    description : String
})


// creat model
const todomodel = mongoose.model('todo', todoschema)


// creat todo 
app.post('/todos', async (req,res) => {
    const { title, description} = req.body;


    try{
        const newTodo =  new todomodel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})



// get all items
app.get('/todos', async (req,res) => {

    try {
        const todos = await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

// update a todo item
app.put('/todos/:id', async (req,res)=>{
    try {
        const { title, description} = req.body;
    const id = req.params.id;
    const updatedtodo = await todomodel.findByIdAndUpdate(
        id,
        {title , description},
        {new : true}
    )

    if(!updatedtodo){
        return res.status(404).json({message: "todo not found!"})
    }
    res.json(updatedtodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

// delete a todo item
app.delete('/todos/:id', async (req,res) => {

    try {
        const id = req.params.id;
    await todomodel.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})


// server
const port = 8000;
app.listen(port, () => {
    console.log(`server is running on ${port}`)
})