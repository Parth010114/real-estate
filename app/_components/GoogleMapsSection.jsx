import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useEffect } from 'react';
import MarkerItem from './MarkerItem';

const containerStyle = {
    width: '100%',
    height: '75vh',
    borderRadius: 10
};

function GoogleMapsSection({coordinates,listing}) {
    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY, // Use .env.local for secure storage
    // });

    const[center, setCenter] = useState({
        lat: -3.745,
        lng: -38.523,
    })

    const [map, setMap] = React.useState(null);

    useEffect(()=>{
        coordinates&&setCenter(coordinates)
    },[coordinates])

    const onLoad = React.useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(() => {
        setMap(null);
    }, []);

    return (
        <div>
            {/* {isLoaded ? ( */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {listing.map((item,index)=>(
                        <MarkerItem key = {index} item={item}/>
                    ))}
                </GoogleMap>
            {/* ) : ( */}
                {/* <div>Loading Map...</div> */}
            {/* )} */}
        </div>
    );
}

export default GoogleMapsSection;
