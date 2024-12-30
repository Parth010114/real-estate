import React from 'react'
import { MarkerF } from '@react-google-maps/api'
import { OverlayView } from '@react-google-maps/api';
import { useState } from 'react';
import MarkerListingItem from './MarkerListingItem';


function MarkerItem({item}) {
    const [selectedListing,setSelectedListing] = useState();
  return (
    <div>
        <MarkerF position={item.coordinates} onClick={()=>setSelectedListing(item)}>
            {selectedListing&& <OverlayView
            position={selectedListing.coordinates}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div>
                    <MarkerListingItem  closeHandler={()=>setSelectedListing(null)}item={selectedListing}/>
                </div>

            </OverlayView>}
        </MarkerF>
    </div>
  )
}

export default MarkerItem