import React from 'react'
import GoogleMapsSection from '@/app/_components/GoogleMapsSection'
import AgentDetail from './AgentDetail'

function Details({listingDetail}) {
  return listingDetail&&(
    <div>
        <div>
            <h2 className='font-bold text-2xl'>Find on map</h2>
            <GoogleMapsSection
            coordinates={listingDetail.coordinates}
            listing={[listingDetail]}
            />
        </div>
        <div>
            <h2 className='font-bold text-2xl'>Contact Agent</h2>
            <AgentDetail listingDetail={listingDetail}/>
        </div>
    </div>
  )
}

export default Details