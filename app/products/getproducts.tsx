"use client"
// import { NextResponse } from "next/server";
// import { GET } from "@/app/products/getproducts"
// import { createClient } from "@/utils/supabase/server";
// import { useEffect, useState } from "react";
// import { createClient } from '@/utils/supabase/client';


export default function GetProducts({ products }: { products: {name: string, price: string, availableqty: number, productid: number}[] }){

    const services = [
        {id:"compute",pname:"Rent Compute",price:299},
        {id:"storage",pname:"Rent Storage",price:399},
        {id:"gpu",pname:"Rent GPUs",price:499}     
    ]

    async function handleBuyServices(p: { id: string; pname: string; price: number;}){
        // const data = GET()
        // console.log(data)
        console.log(`User bought: ${p.pname}`)
    }

    async function handleBuyProducts(product: {name: string, price: number, productid: number}) {
        try {
            const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product: product.name,
                price: product.price,
                productid: product.productid,
            }),
            });

            const data = await res.json();

            console.log(data);

            if (!res.ok) {
            alert(data.error);
            return;
            }

            alert("Added to cart!");

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    }

    return(
        <>
            <h1>Welcome! check out our exciting range of services.</h1>
            <br />

            {services.map((p)=>(
                <div key={p.id}>
                    <div style={{border: "1px solid white", display: "inline-block", padding: "10px"}}>
                        <h2>{p.pname}</h2>
                        <h2>Rent (per second): ${p.price}</h2>
                        <button onClick={()=>handleBuyServices(p)}>Buy</button>
                    </div>
                    <br />
                    <br />
                </div>
            ))}

            <div>
                <h1>Other products.,</h1>
                <br />
                <div>
                    {products.map((p, index) => (
                        <div key={index} style={{border: "1px solid white", display: "inline-block", padding: "10px", margin: "4px"}}>
                            <h2>Name: {p.name}</h2>
                            <h2>Price: ${p.price}</h2>
                            <h2>Available Qty: {p.availableqty}</h2>
                            <button onClick={()=>handleBuyProducts(p)}>Add to cart</button>
                            <br />
                            <br />
                        </div>
                    ))}
                    <br />
                </div>
                <p>More to be released soon...</p>
            </div>
        </>
    )
}