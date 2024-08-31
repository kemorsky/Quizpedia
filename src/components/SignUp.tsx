import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function SignUp() {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const userData = {username, password}
        
    }
    return (
        <div>Sign Up</div>
    )
}