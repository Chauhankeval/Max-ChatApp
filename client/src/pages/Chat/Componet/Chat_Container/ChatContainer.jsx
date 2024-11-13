import React from 'react'
import ChatHeader from './Componets/Chat-Header/Chat-Heder'
import MessageBar from './Componets/Message-bar/Message-Bar'
import MessageContainer from './Componets/Meassage-Container/Message-Container'

const ChatContainer = () => {
  return (
    <div className='fixed top-0 h-[100%] w-[65vw] bg-[#090917] flex flex-col md:static md:flex-1 '
    >
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/> 
    </div>
  )
}

export default ChatContainer