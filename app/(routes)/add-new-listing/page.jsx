"use client"
import GoogleAddressSearch from '@/app/_components/GoogleAddressSearch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from "sonner"
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation'


function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState();
    const [coordinates, setCoordinates] = useState();
    const {user}=useUser();
    const [loader,setLoader]=useState(false);
    const router =useRouter();

    const nextHandler=async()=>{
        console.log(selectedAddress,coordinates)
        setLoader(true)
        const { data, error } = await supabase
        .from('listing')
        .insert([
        { address: selectedAddress.label, coordinates: coordinates, createdBy:user?.primaryEmailAddress.emailAddress },
        ])
        .select();

        if(data){
            console.log("New Data Added,",data);
            setLoader(false)
            toast("New Address Added For Listing")
            router.replace('/edit-listing/'+data[0].id);
        }
        if(error){
            console.log("Error")
            setLoader(false)
            toast("Server Side Error")
        }
        
    }
    return (
        <div className='mt-10 md:mx-56 lg:mx-80'>
            <div className='p-10 flex flex-col gap-5 items-center justify-center'>
                <h2 className='font-bold text-2xl'>AddNewListing</h2>
                <div className='p-10 rounded-lg flex flex-col border shadow-md gap-5 w-full'>
                    <h2 className='text-gray-500'>Enter the property that you want to list</h2>
                    <GoogleAddressSearch 
                    selectedAddress={(value)=>setSelectedAddress(value)}
                    setCoordinates={(value)=>setCoordinates(value)}
                    />
                    <Button 
                    disabled = {!selectedAddress|| !coordinates || loader}
                    onClick={nextHandler}>
                        {loader?<Loader className='animate-spin'/>:"Next"}</Button>
                </div>
            </div>
        </div>
    )
}

export default AddNewListing