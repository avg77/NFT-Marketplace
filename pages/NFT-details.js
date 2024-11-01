import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import { Button, Category, Brand } from '../components/componentsindex'
import NFTDetailsPage from '../NFTDetailsPage/NFTDetailsPage'

import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const NFTDetails = () => {

  const {currentAccount} = useContext(NFTMarketplaceContext)

  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    seller: "",
    price: ""
  })

  const router = useRouter()

  useEffect(() => {
    if(router.isReady)
    setNft(router.query)
  }, [router.isReady, router.query])

  return (
    <div>
    <NFTDetailsPage nft={nft}/>
    <Category />
    <Brand />
    </div>
    
  )
}

export default NFTDetails