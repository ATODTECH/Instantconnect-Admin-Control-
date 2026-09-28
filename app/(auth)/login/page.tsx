import LoginHomeIndex from "@/components/login"
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Login - InstantConnect",
  description: "Welcome back, Admin. InstantConnect overview and quick metrics login screen",
};


const Login: NextPage = () => {
  
  return (
    <>
      <LoginHomeIndex />
    </>
  )
}

export default Login