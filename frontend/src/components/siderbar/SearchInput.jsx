import React from 'react'
import { IoSearchSharp } from "react-icons/io5";

const SearchInput = () => {
  return (
    <form className='flex items-center gap-2'>
        <input type='text' placeholder='Search...' className='input file-input-bordered rounded-full'></input>
        <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
            <IoSearchSharp className='w-6 h-6 outline-none'/>
        </button>
    </form>
  )
}

export default SearchInput



// START CODE FOR THIS FILE:

// import React from 'react'
// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
//   return (
//     <form className='flex items-center gap-2'>
//         <input type='text' placeholder='Search...' className='input file-input-bordered rounded-full'></input>
//         <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
//             <IoSearchSharp className='w-6 h-6 outline-none'/>
//         </button>
//     </form>
//   )
// }

// export default SearchInput