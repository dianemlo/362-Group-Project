import './App.css'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Home from './pages/home/Home'


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
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Home />
    </div>
  )
}

export default App