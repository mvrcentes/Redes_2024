import React from "react"

import { Signin } from "@/app/components/auth/Signin/Signin"
const page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Signin />
    </div>
  )
}

export default page
