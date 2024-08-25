"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Login from "./Login"
import Register from "./Register"

const Auth = () => {
  // State to manage the currently active tab ('login' or 'register')
  const [activeTab, setActiveTab] = useState("login")

  // State to store registration form values, which can be passed to the Login component
  const [registerValues, setRegisterValues] = useState(null)

  // Function to handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab) // Set the active tab to the selected tab
  }

  return (
    // Tabs component to manage login and register views
    <Tabs
      value={activeTab} // Set the value of the active tab
      onValueChange={handleTabChange} // Change the active tab when a new tab is selected
      className="w-[400px]">
      {/* Tab headers for switching between Login and Register */}
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      {/* Content for the Login tab */}
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Login component, passing down any registration values if they exist */}
            <Login registerValues={registerValues} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Content for the Register tab */}
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Register component, passing down functions to change the tab and store registration values */}
            <Register
              handleChangeTab={handleTabChange} // Allow the Register component to switch to the Login tab after successful registration
              setRegisterValues={setRegisterValues} // Allow the Register component to store registration values
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default Auth
