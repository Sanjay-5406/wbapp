import { notFound } from "next/navigation"

async function fetchUser(id: string){
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    
    if(!res.ok){
        return null
    }
    const user = await res.json()
    return user
}

export default async function UserPage({params}:{params: Promise<{userId: string}>}){

    const {userId} = await params
    const user = await fetchUser(userId)

    if(!user){
        notFound()
    }
    return(
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    )
}