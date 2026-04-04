import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login as loginBackend } from "@/backend/auth"
import AlertDestructive from "@/components/ErrorAlert"

const Login = () => {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validate = (): string | null => {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    if (!trimmedEmail && !trimmedPassword) return "Email and password are required"
    if (!trimmedEmail) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return "Please enter a valid email address"
    if (!trimmedPassword) return "Password is required"
    if (trimmedPassword.length < 6) return "Password must be at least 6 characters"
    return null
  }

  const submitHandler = async () => {
    setError("")
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      await loginBackend(email.trim(), password, dispatch)
      navigate("/")
    } catch (e: any) {
      console.log(`Error=>${e.message}`)
      setError(e.message)
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center pt-0 antialiased [background:radial-gradient(125%_100%_at_50%_0%,#FFF_6%,#E0F0FF_30%,#E7EFFD_70%,#FFF_400%)]">
      {error && (
        <div className="w-full max-w-sm mb-2">
          <AlertDestructive title="Error" desc={error} />
        </div>
      )}
      <Card className="w-full max-w-sm opacity-90 shadow-gradient from-black to-gray-900 shadow-xl">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => nav("/signup")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" onClick={submitHandler}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
