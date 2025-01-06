/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import './App.css'


function App() {

    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [editingTask, setEditingTask] = useState(null);
  
    const getTask = () => {
      axios.get("http://localhost:3000")
        .then(res => {
          setTasks(res.data.taskItems);
        })
        .catch(err => {
          console.log("error");
        });
    };
  
    useEffect(() => {
      getTask();
    }, []);
  
    const changeHandler = (e) => {
      setTaskInput(e.target.value);
    };
  
    const formSubmitHandler = (e) => {
      e.preventDefault();
      if (editingTask !== null) {
        axios.put(`http://localhost:3000/task/${editingTask}`, { task: taskInput })
          .then(() => {
            setTaskInput("");
            setEditingTask(null);
            getTask();
          })
          .catch(() => {
            console.log("Error");
          });
      } else {
        axios.post("http://localhost:3000", { task: taskInput })
          .then(() => {
            setTaskInput("");
            getTask();
          })
          .catch(() => {
            console.log("Error");
          });
      }
    };
  
    const editTask = (id) => {
      const taskToEdit =tasks.find(task=>task._id === id);
      setTaskInput(taskToEdit.task);
      setEditingTask(id);
    };
  
    const deleteTask = (id) => {
      axios.delete(`http://localhost:3000/task/${id}`)
        .then(res => {
          getTask();
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    return (
      <>
       <Container >
        <h1 className='head'>Todo App</h1>
        <form onSubmit={formSubmitHandler}>
          <div className = 'input'>
          <input type="text" placeholder="Enter task" value={taskInput} onChange={changeHandler} /> 
          <input type="submit" value={editingTask !== null ? "Update task" : "Add task"} />
          </div>
        </form>
        
        <ul>
       
          {tasks.map((task, index) => {
            return (
              <div key={task._id}>
              <ListGroup  as="ol">
              <ListGroup.Item as="li" key={index}>
                <div  className='list'>
                {task.task}
                <div>
                <button className='button' onClick={() => editTask(task._id)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
                </div>
                </ListGroup.Item>
                </ListGroup>
                </div>
            );
          })}
                 
        </ul>
        </Container>
      </>
    );
  }
  


export default App
