import React from 'react'
import Logo from "../../src/assets/react.svg";

const NavBar = () => {
  return (
    <div className='flex justify-between w-full px-20 py-2 bg-gray-100'>
      <div className='flex gap-2 items-center justify-center'>
        <img src={Logo} alt=''/>
        <h1 className='text-xl font-bold text-cyan-400 font-serif italic '>G-AI Bot</h1>
      </div>
      <div className='flex w-[10%] gap-8 justify-between text-lg font-medium font-serif'>
        <a href=''>Home</a>
        <a href=''>About</a>
      </div>
    </div>
  )
}

export default NavBar;
