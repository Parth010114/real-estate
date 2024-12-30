import { supabase } from '@/utils/supabase/client';
import { BathIcon, BedDouble, MapPin, Ruler } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function UserListing() {
    const {user} = useUser();
    const [listing, setListing] = useState();
    useEffect(()=>{
        user&&GetUserListing();
    },[user])
    const GetUserListing=async()=>{
        const {data,error}=await supabase
        .from('listing')
        .select('*,listingImages(url,listing_id)')
        .eq('createdBy',user?.primaryEmailAddress.emailAddress);
        setListing(data)

        console.log(data)
    }
  return (
    <div>
        <h2 className='font-bold text-2xl'>Manage your listing</h2>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {listing&&listing.map((item,index)=>(
                 <div key={item.id || index} className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg">
                 <Image src={item?.listingImages[0]?.url}
                     width={800}
                     height={150}
                     className='rounded-lg object-cover h-[170px]' alt={item.title || "Listing Image"} />
                 <div className='flex mt-2 gap-2 flex-col'>
                     <h2 className='font-bold text-xl'>${item?.price}</h2>
                     <h2 className='flex gap-2 text-sm text-gray-400'><MapPin className='h-4 w-4' />{item.address}</h2>
                     <div className='flex gap-2 mt-2 justify-between'>
                         <h2 className='flex w-full gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center'>
                             <BedDouble className='h-4 w-4' />
                             {item?.bedroom}
                         </h2>
                         <h2 className='flex w-full gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center'>
                             <BathIcon className='h-4 w-4' />
                             {item?.bathroom}
                         </h2>
                         <h2 className='flex w-full gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center'>
                             <Ruler className='h-4 w-4' />
                             {item?.area}
                         </h2>
                     </div>
                 </div>
             </div>
            ))}
        </div>
    </div>
  )
}

export default UserListing