"use client"
import { supabase } from "@/lib/supabase"
import { useState } from "react";
import { useRouter } from "next/navigation"

export default function Signup(){
    const router = useRouter()
    const [email,setemail] = useState("")
    const [password, setpassword] = useState("")


    async function handleSignup(e: React.FormEvent){
        e.preventDefault()

        const {error} = await supabase.auth.signUp({email,password})

        if(error){
            console.log(error.message)
        }
        router.push("/")
        console.log("Succesfully signed up !")
    }




    return(
        
            <div style={{border:"1px solid grey", display: "inline", padding: "20px", margin: "4px"}}>
                <h1>Welcome to the Sign Up page !</h1>
                <br />  
                <form onSubmit={handleSignup} style={{display:"inline"}}>
                    <label style={{}}>Enter Email: <input type="email" onChange={(e)=>setemail(e.target.value)} placeholder="abc@gmail.com" style={{border:"1px solid grey", margin:"4px", padding: "4px"}} /></label> <br />
                    <label htmlFor="">Enter Password: <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="******" style={{border:"1px solid grey", margin:"4px", padding: "4px"}}/></label> <br />
                    <button type="submit">Login</button>
                </form>
            </div>
            
        
    )
    

}