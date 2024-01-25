import React, { useState, useEffect, useMemo } from 'react';
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5"
import { FaCircle } from "react-icons/fa6";
import { TfiHandDrag } from "react-icons/tfi";
import { MdOutlineDoneOutline } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Delete from "./Delete"
import Update from "./Update"
import Add from './Add';
const Main = () => {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")) || []);
  const [completedTasks, setCompletedTasks] = useState(JSON.parse(localStorage.getItem("completedTasks")) || []);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [creating, setcreating] = useState(false);

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };
  const getColorForPriority = (priority) => {
    switch (priority) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'orange'; 
      case 'High':
        return 'red'; 
      default:
        return 'gray'; 
    }
  };
  
  useEffect(() => {
    if (localStorage) {
      const storedTasks = localStorage.getItem('tasks');
      const storedCompletedTasks = localStorage.getItem('completedTasks');

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      if (storedCompletedTasks) {
        setCompletedTasks(JSON.parse(storedCompletedTasks));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;

    const newTaskObject = {
      id: Date.now(),
      text: newTask,
      priority: priority,
    };

    setTasks((prevTasks) => [...prevTasks, newTaskObject]);
    setNewTask('');
    setPriority('Low');
    setcreating(false);
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setEditingTaskId(null);
  };

  const completeTask = (taskId) => {
    const taskToComplete = tasks.find((task) => task.id === taskId);

    if (taskToComplete) {
      setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, taskToComplete]);
      deleteTask(taskId);
    }
  };

  const updatePriority = (taskId, newPriority) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

  const startEditingTask = (taskId, taskText) => {
    setEditingTaskId(taskId);
    setEditingTaskText(taskText);
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);
  
    setTasks(updatedTasks);
  };
  
  const saveEditedTask = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTaskId ? { ...task, text: editingTaskText } : task
      )
    );
    setEditingTaskId(null); // Reset editing state after saving changes
  };

  return (
    <div>
      <div className="flex  justify-center">
        <button onClick={() => { setcreating(true) }} className='m-2 flex items-center customfont font-[700]'>Add New Task :<Add /></button>
      </div>
      {creating && <div className='createtask m-2 max-w-xs mb-3 mx-auto mt-4 p-4 bg-white shadow-md rounded-md'>
  <label className='block mb-2'>
    Task:
    <textarea
    maxLength={"50"}
      className='w-full resize-none p-2 border outline-none border-gray-300 rounded-md mt-1'
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />
  </label>
  <label className='block mb-2'>
    Priority:
    <select
      className='w-full p-2 border border-gray-300 rounded-md mt-1'
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  </label>
  <button
    className='bg-green-500 text-white p-2 rounded-md cursor-pointer hover:bg-green-600'
    onClick={addTask}>
    Add Task
  </button>
</div>
}
      {/* Tabs */}
      <div className="flex justify-center flex-col md:flex-row items-center bg-zinc-100 p-4  ">
        <button
          onClick={() => showTab('todos')}
          className={`text-black px-4 customfont font-[400] py-2  focus:outline-none ${activeTab === 'todos' ? 'bgTabs text-yellow-500' : ''
            }`}
        >
          To-Do's ({tasks.length})
        </button>
        <button
          onClick={() => showTab('completed')}
          className={`text-black flex items-center gap-1 px-2 md:px-4 py-2 customfont font-[400]  focus:outline-none ${activeTab === 'completed' ? 'bgTabs text-green-600' : ''
            }`}
        >
          Completed Todos <IoCheckmarkDoneCircleOutline size={20} />
        </button>
      </div>
      {activeTab == "todos" &&
  <DragDropContext onDragEnd={onDragEnd}>
     <div className='flex justify-center mt-[2rem]'>
       <Droppable droppableId="tasks">
         {(provided) => (
           <ul
             className='w-[60vw]'
             {...provided.droppableProps}
             ref={provided.innerRef}
           >
             { tasks.length == 0 ? <p className='text-xl customfont text-center text-gray-500'>No Tasks for Today Enjoy !</p> :
             tasks.map((task, index) => (
            <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`bgTask m-2 flex-col md:flex-row flex items-center justify-between p-3 ${editingTaskId === task.id ? 'bg-white' : 'bg-gray-200'}`}
              >
                     {editingTaskId === task.id ? (
                       <>
                         <textarea
                           maxLength={"70"}
                           className='w-full resize-none p-2 m-2 border outline-none border-gray-300 rounded-md mt-1'
                           value={editingTaskText}
                           onChange={(e) => setEditingTaskText(e.target.value)}
                         />
                         <button onClick={saveEditedTask} className="p-2 bg-blue-500 text-white"><FaRegSave /></button>
                       </>
                     ) : (
                       <>
                         <div className='flex w-[20vw] m-2 items-center gap-3'>
                           <TfiHandDrag size={20} />
                           <div className="mr-2 md:text-[1.2rem] sm:text-xl customfont font-[700]">{task.text}</div>
                         </div>
   
                         <div className='flex flex-wrap justify-center gap-4 items-center '>
                           <button onClick={() => deleteTask(task.id)} className="p-2 bg-red-500 text-white"><Delete /></button>
                           <button onClick={() => completeTask(task.id)} className="p-2 bg-green-500 text-white"><MdOutlineDoneOutline /></button>
                           <button onClick={() => startEditingTask(task.id, task.text)} className="p-2 bg-yellow-500 text-white"><Update /></button>
                           <FaCircle
                             color={getColorForPriority(task.priority)}
                             className="mr-2"
                           />
                           <select
                             value={task.priority}
                             onChange={(e) => updatePriority(task.id, e.target.value)}
                             className="p-2 border outline-none border-gray-300"
                           >
                             <option value="Low">Low</option>
                             <option value="Medium">Medium</option>
                             <option value="High">High</option>
                           </select>
                         </div>
                       </>
                     )}
                   </li>
                 )}
               </Draggable>
             ))}
             {provided.placeholder}
           </ul>
         )}
       </Droppable>
     </div>
   </DragDropContext>
   }

      {activeTab === 'completed' && 
      (
       
       <div className=" flex justify-center  mt-[2rem]">
          <ul className='flex flex-col w-[60vw]'>
            {completedTasks.length == 0 ? <p className='text-xl customfont text-center text-gray-500'>You have'nt completed any task Yet !</p>:
            
            completedTasks.map((task) => (
              <li key={task.id} className='bgTask  m-2 flex items-center   justify-between  p-3'>
             <span className='customfont font-[700]'>   {task.text} </span>
                <button className='flex items-center gap-3 text-green-600' onClick={() => deleteTask(task.id)}> Completed<IoMdDoneAll size={20} color='green' /></button>
              </li>
            ))}
          </ul>
        </div>


      )
      
      }

    </div>
  );
};

export default Main;
