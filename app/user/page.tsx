

export default async function User(){
    const res = await fetch("https://jsonplaceholder.typicode.com/users")
    const posts = await res.json()
    console.log(posts)
    return(
        <div>
            Welcome user!
        </div>
    )
}