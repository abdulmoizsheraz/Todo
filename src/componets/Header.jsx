import React from 'react'

const Header = () => {
  return (
    <>
<div class="h-2 w-full   bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
   <div className='flex items-center flex-col md:flex-row gap-5 justify-center text-3xl customfont font-[700] text-center mt-6 '>
   <img src="./logo.png" alt="" />
    Task Managment
   </div>
  </>
  )
}

export default Header