import { useState, React } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import UserDashboard from './pages/user/userDashboard'
import MyTask from './pages/user/myTasks'
import CreateNewTask from './pages/admin/createNewTask'
import Dashboard from './pages/admin/dashboard'
import ManageTask from './pages/admin/manageTask'
import ManageUser from './pages/admin/manageUser'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Render login and signup pages */}
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          
      
          {/* Render User pages */}
          <Route element={<ProtectedRoute/>} allowedUsers={'Member'}>
            <Route path='/user/dashboard' element={<UserDashboard/>}></Route>
            <Route path='/user/tasks' element={<MyTask/>}></Route>
          </Route>

          {/* render admin pages */}
          <Route element={<ProtectedRoute/>} allowedUsers={'Admin'}>
            <Route path='/admin/new-Task' element={<CreateNewTask/>}></Route>
            <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
            <Route path='/admin/manage-Task' element={<ManageTask/>}></Route>
            <Route path='/admin/manage-User' element={<ManageUser/>}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
