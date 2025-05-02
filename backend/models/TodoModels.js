import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
