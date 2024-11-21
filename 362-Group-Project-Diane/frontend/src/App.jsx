import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Home from './pages/home/Home'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from "./context/AuthContext"


// to show the Login page
// function App() {
//   return (
//     <div className='p-4 h-screen flex items-center justify-center'>
//       <Login />
//     </div>
//   )
// }
//   export default App

// to show the SignUp page
// function App() {
//   return (
//     <div className='p-4 h-screen flex items-center justify-center'>
//       <SignUp />
//     </div>
//   )
// }
// export default App

// to show the Home page
function App() {
  const {authUser}= useAuthContext();
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to ={"/login"} />} /> 
        <Route path='/login' element={authUser ? <Navigate to ="/" /> : <Login />} /> 
        <Route path='/signup' element={authUser ? <Navigate to ="/" /> : <SignUp />} /> 
      </Routes>
      <Toaster />
    </div>
  )
}

export default App