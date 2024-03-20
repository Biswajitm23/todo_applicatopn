import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [nData, setNData] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [todoToEdit, setTodoToEdit] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editSubject, setEditSubject] = useState('');
    const [editStatus, setEditStatus] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }

            const response = await axios.get(`http://localhost:8000/posts/${userId}`);
            const userTodos = response?.data?.todos || [];
            setTodos(userTodos);
            setNData(response?.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            toast.error('Error fetching todos!');
        }
    };

    const inputFunction = (e) => {
        if (e.target.name === 'title') {
            setTitle(e.target.value);
        } else if (e.target.name === 'subject') {
            setSubject(e.target.value);
        }
    };
    const submitData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }
    
            const response = await axios.get(`http://localhost:8000/posts/${userId}`);
            const existingUserData = response?.data || {};
            const { todos: existingTodos, ...otherUserData } = existingUserData;
    
            const id = `${userId}-t${existingTodos.length + 1}`; // Append userId to the todo item ID
            const date = new Date();
            const indianTime = date.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
            const formattedDate = date.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
    
            const newTodo = {
                id: id,
                title: title,
                subject: subject,
                status: '0',
                date: formattedDate + ' ' + indianTime
            };
    
            const updatedTodos = [...existingTodos, newTodo];
    
            const updateResponse = await axios.put(`http://localhost:8000/posts/${userId}`, {
                ...otherUserData,
                todos: updatedTodos
            });
    
            fetchData();
    
            setTitle('');
            setSubject('');
    
            toast.success('Todo added successfully!');
        } catch (error) {
            console.error('Error adding todo:', error.message);
            toast.error('Error adding todo!');
        }
    };

    

    const onDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
    
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
    
        if (startIndex === endIndex) {
            return;
        }
    
        const updatedTodos = Array.from(todos);
        const [draggedTodo] = updatedTodos.splice(startIndex, 1);
        updatedTodos.splice(endIndex, 0, draggedTodo);
    
        try {
            // Prepare the payload with only the todos array
            const updatedPayload = {
                todos: updatedTodos
            };
    
            // Retrieve the userId from localStorage
            const userId = localStorage.getItem('userId');
    
            // Update the state with the rearranged todos
            setTodos(updatedTodos);
    
            // Delay the backend update using setTimeout
            setTimeout(async () => {
                try {
                    // Fetch the user data from the backend
                    const response = await axios.get(`http://localhost:8000/posts/${userId}`);
                    const userData = response.data;
    
                    // Update the todos array for the specific user
                    const updatedUser = {
                        ...userData,
                        todos: updatedTodos
                    };
    
                    // Send a PUT request to update the user data in the database with the updated todos
                    await axios.put(`http://localhost:8000/posts/${userId}`, updatedUser);
    
                    toast.success('Todo order updated successfully!');
                } catch (error) {
                    console.error('Error updating todo order:', error);
                    toast.error('Error updating todo order!');
                }
            }, 100); // 1 second delay
        } catch (error) {
            console.error('Error updating todo order:', error);
            toast.error('Error updating todo order!');
        }
    };
    
    
    

    const handleDelete = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }

            const filteredTodos = todos.filter(todo => todo.id !== todoToDelete.id);

            const updateResponse = await axios.put(`http://localhost:8000/posts/${userId}`, {
                ...nData,
                todos: filteredTodos
            });

            fetchData();

            setShowDeleteModal(false);

            toast.success('Todo deleted successfully!');
        } catch (error) {
            console.error('Error deleting todo:', error.message);
            toast.error('Error deleting todo!');
        }
    };

    const handleEdit = (todo) => {
        setTodoToEdit(todo);
        setEditTitle(todo.title);
        setEditSubject(todo.subject);
        setEditStatus(todo.status === '1');
        setShowEditModal(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }

            const updatedTodo = {
                id: todoToEdit.id,
                title: editTitle,
                subject: editSubject,
                status: editStatus ? '1' : '0',
                date: todoToEdit.date
            };

            const updatedTodos = todos.map(todo => todo.id === todoToEdit.id ? updatedTodo : todo);
            const updateResponse = await axios.put(`http://localhost:8000/posts/${userId}`, {
                ...nData,
                todos: updatedTodos
            });

            fetchData();

            setShowEditModal(false);

            toast.success('Todo edited successfully!');
        } catch (error) {
            console.error('Error editing todo:', error.message);
            toast.error('Error editing todo!');
        }
    };

    const toggleEditStatus = () => {
        setEditStatus(prevStatus => !prevStatus);
    };

    return (
        <div className="container py-5 todolist">
            <h1 className='fw-bold text-center'>TODO LIST</h1>
            <div className="add-button-area" id="add-button-area-wrap">
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="16px" width="16px">
                        <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                    <span>Add More</span>
                </button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId={todos} key={todos}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="row">
                {todos && todos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-lg-12 mb-4">
                                <Card>
                                                <Card.Body>
                                                    <div className='header-card'>
                                                        <Card.Title> Title :- {todo.title}</Card.Title>
                                                        <div className='actionArea'>
                                                            <button className="btn btn-sm" onClick={() => handleEdit(todo)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                                                                    <path fill="#FFD43B" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                                </svg>
                                                            </button>
                                                            <button className="btn btn-sm" onClick={() => {
                                                                setTodoToDelete(todo);
                                                                setShowDeleteModal(true);
                                                            }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                                                                    <path fill="#f70808" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Card.Text> Description :- {todo.subject}</Card.Text>
                                                    <div className='footer-card'>
                                                        <Card.Text>{todo.status === '0' ? 'Incomplete' : 'Complete'}</Card.Text>
                                                        <Card.Text>{todo.date}</Card.Text>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitData}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Your Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={inputFunction}
                                className="form-control"
                                id="title"
                                placeholder="Enter title"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="subject" className="form-label">
                                Your Description
                            </label>
                            <textarea
                                className="form-control"
                                name="subject"
                                value={subject}
                                onChange={inputFunction}
                                id="subject"
                                rows="6"
                                placeholder="Enter Description"
                                required
                            ></textarea>
                        </div>
                        <div className="text-center">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this todo?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitEdit}>
                        <div className="mb-3">
                            <label htmlFor="editTitle" className="form-label">
                                New Title
                            </label>
                            <input
                                type="text"
                                name="editTitle"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="form-control"
                                id="editTitle"
                                placeholder="Enter new title"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editSubject" className="form-label">
                                New Description
                            </label>
                            <textarea
                                className="form-control"
                                name="editSubject"
                                value={editSubject}
                                onChange={(e) => setEditSubject(e.target.value)}
                                id="editSubject"
                                rows="6"
                                placeholder="Enter new description"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="editStatus"
                                checked={editStatus}
                                onChange={toggleEditStatus}
                            />
                            <label className="form-check-label" htmlFor="editStatus">
                                Mark as complete
                            </label>
                        </div>
                        <div className="text-center">
                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TodoList;
