import React from 'react'
import useConversation from '../../zustand/useConversation'
import { useSocketContext } from '../../context/SocketContext';

const Conversation = ({conversation, lastIdx, emoji}) => {
    const {selectedConversation, setSelectedConversation} = useConversation();

    const isSelected = selectedConversation?._id === conversation._id;

    const {onlineUsers} = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id)

  return <>
    <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
        ${isSelected ? "bg-sky-500" : ""}
    `}
        onClick={() => setSelectedConversation(conversation)}
    >
        
        <div className={`avatar ${isOnline ? "online" : ""}`}>
            <div className='w-12 rounded-full'>
                <img src={conversation.profilePic} 
                alt='user avatar' />
            </div>
        </div>
        
        <div className='flex flex-col flex-1'>
            <div className='flex gap-3 justify-between'>
                <p className='font-bold text-gray-200'>{conversation.fullName}</p>
                <span className='text-xl'>{emoji}</span>
            </div>
        </div>

    </div>

    {!lastIdx && <div className='divider my-0 py-0 h-1' />}
  </>
}

export default Conversation




// STARTER CODE FOR THIS FILE

// const Conversation = () => {
//     return <>
//       <div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
          
//           <div className='avatar online'>
//               <div className='w-12 rounded-full'>
//                   <img src='https://i.pinimg.com/736x/e7/b4/ca/e7b4cada7bc4b4ba68765b7c6c512c63.jpg' 
//                   alt='user avatar' />
//               </div>
//           </div>
          
//           <div className='flex flex-col flex-1'>
//               <div className='flex gap-3 justify-between'>
//                   <p className='font-bold text-gray-200'>dianemlo</p>
//                   <span className='text-xl'>😝</span>
//               </div>
//           </div>
  
//       </div>
  
//       <div className='divider my-0 py-0 h-1' />
//     </>
//   }
  
//   export default Conversation