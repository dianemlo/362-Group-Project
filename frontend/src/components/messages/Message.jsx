import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation'
import { extractTime } from '../../utils/extractTime'

const Message = ({message}) => {
  const {authUser} = useAuthContext()
  const {selectedConversation} = useConversation()
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const profilePic = fromMe ? authUser.profilePic: selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? 'bg-blue-500' : "";


  return (
    <div className={`chat ${chatClassName}`}>
        <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
                <img 
                  alt='Tailwind CSS chat bubble component' 
                  src={profilePic} />
            </div>
        </div>

        <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>{message.message}</div>
        <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>

    </div>
  )
}

export default Message



// STARTER CODE FOR THIS FILE:

// import React from 'react'

// const Message = () => {
//   return (
//     <div className='chat chat-end'>
//         <div className='chat-image avatar'>
//             <div className='w-10 rounded-full'>
//                 <img alt='Tailwind CSS chat bubble component' src='https://i.pinimg.com/736x/e7/b4/ca/e7b4cada7bc4b4ba68765b7c6c512c63.jpg' />
//             </div>
//         </div>

//         <div className={'chat-bubble text-white bg-blue-500'}>Hi! What is up?</div>
//         <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12:42</div>

//     </div>
//   )
// }

// export default Message