'use client'

export default function Products(){

    const products = [
        {id:"compute",pname:"Rent Compute",price:299},
        {id:"storage",pname:"Rent Storage",price:399},
        {id:"gpu",pname:"Rent GPUs",price:499}     
    ]

    function handleBuy(id: string){
        console.log(`User bought: ${id}`)
    }

    return(
        <>
            <h1>Welcome! check out our exciting range of products.</h1>
            <br />

            {products.map((p)=>(
                <div key={p.id}>
                    <div style={{border: "1px solid white", display: "inline-block", padding: "10px"}}>
                        <h2>{p.pname}</h2>
                        <h2>Rent (per second): ${p.price}</h2>
                        <button onClick={()=>handleBuy(p.id)}>Buy</button>
                    </div>
                    <br />
                    <br />
                </div>
            ))}

        </>
    )
}