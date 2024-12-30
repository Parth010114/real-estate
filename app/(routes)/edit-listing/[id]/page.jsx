"use client"
import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { Formik } from 'formik';
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase/client';
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import FileUpload from '../_components/FileUpload'
import { Loader } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



function EditListing() {
    const params = usePathname();
    const { user } = useUser();
    const router = useRouter();
    const [listing, setListing] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        // console.log(params.split('/')[2]);
        user && verifyUserRecord();
    }, [user]);

    const verifyUserRecord = async () => {
        const { data, error } = await supabase
            .from('listing')
            .select('*,listingImages(listing_id,url)')
            .eq('createdBy', user?.primaryEmailAddress.emailAddress)
            .eq('id', params.split('/')[2]);

        if (data) {
            console.log(data)
            setListing(data[0]);
        }

        if (data?.length <= 0) {
            router.replace('/')
        }
    }

    const onSubmitHandler = async (formValue) => {
        setLoading(true)

        const { data, error } = await supabase
            .from('listing')
            .update(formValue)
            .eq('id', params.split('/')[2])
            .select();

        if (data) {
            console.log(data);
            toast('Listing updated and published')
            setLoading(false)
        }
        for (const image of images) {
            setLoading(true)
            const file = image;
            const fileName = Date.now().toString();
            const fileExt = fileName.split('.').pop();

            const { data, error } = await supabase.storage
                .from('listingImages')
                .upload(`${fileName}`, file, {
                    contentType: `image/${fileExt}`,
                    upsert: false
                })

            if (error) {
                setLoading(false)
                toast('Error while upoading images')
            }
            else {

                const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
                const { data, error } = await supabase
                    .from('listingImages')
                    .insert([
                        { url: imageUrl, listing_id: params?.split('/')[2] },
                    ])
                    .select()
                if (error) {
                    setLoading(false)
                }

            }
            setLoading(false)
        }

    }

    const publishBtnHandler = async() => {
        setLoading(true)

        const { data, error } = await supabase
            .from('listing')
            .update({ active:true })
            .eq('id', params?.split('/')[2])
            .select()

        if(data){
            setLoading(false)
            toast('Listing Published!')
        }

    }

    return (
        <div className='px-10 md:px-36 my-10'>
            <h2 className='font-bold text-2xl'>Enter Some More Details About Your Property</h2>
            <Formik
                initialValues={{
                    type: '',
                    propertyType: '',
                    profileImage: user?.imageUrl,
                    fullName: user?.fullName

                }}
                onSubmit={(values) => {
                    console.log(values);
                    onSubmitHandler(values);
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='p-8 rounded-lg shadow-md space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-3'>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Rent or Sell</h2>
                                    <RadioGroup defaultValue={listing?.type} onValueChange={(v) => values.type = v}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Rent" id="Rent" />
                                            <Label htmlFor="Rent">Rent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Sell" id="Sell" />
                                            <Label htmlFor="Sell">Sell</Label>
                                        </div>
                                    </RadioGroup>

                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Property Type</h2>
                                    <Select onValueChange={(e) => values.propertyType = e} name="propertyType" defaultValue={listing?.propertyType}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={listing?.propertyType ? listing?.propertyType : "Select Property Type"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single Family House">Single Family House</SelectItem>
                                            <SelectItem value="Town House">Town House</SelectItem>
                                            <SelectItem value="Condo">Condo</SelectItem>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Bedroom</h2>
                                    <Input type="number" id="bedroom" placeholder="Ex.2" onChange={handleChange} defaultValue={listing?.bedroom} />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Bathroom</h2>
                                    <Input type="number" id="bathroom" placeholder="Ex.2" onChange={handleChange} defaultValue={listing?.bathroom} />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Built-In</h2>
                                    <Input id="builtin" placeholder="2015" onChange={handleChange} defaultValue={listing?.builtin} />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Parking</h2>
                                    <Input type="number" id="parking" placeholder="Ex.2" onChange={handleChange} defaultValue={listing?.parking} />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Lot Size (Sq-Ft)</h2>
                                    <Input type="number" id="lotSize" placeholder="Ex.200 Sq.Ft" onChange={handleChange} defaultValue={listing?.lotSize} />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Area (Sq.Ft)</h2>
                                    <Input type="number" id="area" placeholder="Ex.1900 Sq.Ft" onChange={handleChange} defaultValue={listing?.area} />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Selling Price($)</h2>
                                    <Input type="number" id="price" placeholder="Ex.400000" onChange={handleChange} defaultValue={listing?.price} />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>HOA(Per-Month)($)</h2>
                                    <Input type="number" id="hoa" placeholder="Ex.100" onChange={handleChange} defaultValue={listing?.hoa} />
                                </div>
                            </div>
                            <div className='grid grid-col-1 gap-10'>
                                <div className="flex gap-2 flex-col">
                                    <h2 className='text-gray-500'>Description</h2>
                                    <Textarea placeholder="" id="description" onChange={handleChange} defaultValue={listing?.description} />
                                </div>
                            </div>
                            <div>
                                <h2 className='font-lg my-2 text-gray-500'>Upload Property Images</h2>
                                <FileUpload setImages={(value) => setImages(value)} imageList={listing.listingImages} />
                            </div>
                            <div className='flex gap-7 justify-end'>
                                <Button disabled={loading} variant="outline" className="text-primary border-purple-500">{loading ? <Loader className='animate-spin' /> : 'Save'}</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" disabled={loading}>{loading ? <Loader className='animate-spin' /> : 'Save & Publish'}</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Do you really want to publish the listing?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => publishBtnHandler()}>{loading ? <Loader className='animate-spin' /> : 'Continue'}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>


                            </div>
                        </div>
                    </form>)}
            </Formik>
        </div>
    )
}

export default EditListing