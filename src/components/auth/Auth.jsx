"use client"

import { act, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Login from "./Login"
import Register from "./Register"

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [registerValues, setRegisterValues] = useState(null)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  console.log(registerValues)

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Login registerValues={registerValues}/>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <Register
              handleChangeTab={handleTabChange}
              setRegisterValues={setRegisterValues}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default Auth
