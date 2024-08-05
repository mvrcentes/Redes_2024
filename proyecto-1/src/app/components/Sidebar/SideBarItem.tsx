"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import classNames from "classnames"


interface SideBarItemProps {
  title: string
  path: string
  children?: React.ReactNode
}

const SideBarItem = ({ title, path, children } : SideBarItemProps) => {
  const pathName = usePathname()
  const isActive = pathName === path


  return (
    <Link href={path} 
    className=
    {classNames({
      "flex flex-col gap-1 justify-center items-center p-4": true,
      "bg-[#464646] rounded-xl": isActive,
    })}>
      {children}
      <p className='text-[10px] text-[#898787]'>{title}</p>
    </Link>
  )
}

export default SideBarItem
