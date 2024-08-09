import React from 'react'
import AddContact from './Items/AddContact'
import Notifications from './Items/Notifications'

const Sidebar = () => {
  return (
    <div className='h-full w-42 p-2 py-4 flex flex-col gap-6 text-[#898787]'>
      <AddContact />
      <Notifications />
    </div>
  )
}

export default Sidebar