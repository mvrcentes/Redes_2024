import Image from "next/image"

import TestPage from "@/components/auth/test"
import { Signin } from "./components/auth/Signin/Signin"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Signin />
    </main>
  )
}
