"use client"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){
    const router = useRouter()
    const [email, setemail] = useState()
    const [password, setpassword] = useState()

    async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        const {error} = await supabase.auth.signInWithPassword({email, password})
        if(error){
            console.log(error.message)
            console.log("not a valid emai/password")
            return;
        }
        router.push("/")
        console.log("Successfully logged-in !")
    }

    return(
        <div style={{border:"1px solid grey", display: "inline", padding: "20px", margin: "4px"}}>
            <form onSubmit={handleLogin} style={{display:"inline"}}>
                <label style={{}}>Enter Email: <input type="email" onChange={(e)=>setemail(e.target.value)} placeholder="abc@gmail.com" style={{border:"1px solid grey", margin:"4px", padding: "4px"}} /></label> <br />
                <label htmlFor="">Enter Password: <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="******" style={{border:"1px solid grey", margin:"4px", padding: "4px"}}/></label> <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}