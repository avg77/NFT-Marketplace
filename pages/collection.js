import React, {useState, useEffect, useContext} from 'react'
import Style from "../styles/collection.module.css"
import images from "../img"
import { Banner, NFTCardTwo } from '../collectionPage/collectionindex'
import { Slider, Brand } from "../components/componentsindex";
import Filter from "../components/Filter/Filter";
import CollectionProfile from '../collectionPage/collectionProfile/collectionProfile';

import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';

const collection = () => {

  const {fetchUnsoldNFTs} = useContext(NFTMarketplaceContext)
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchUnsoldNFTs().then((item) => {
      setNfts(item.reverse())
    })
  }, [])
    /* const collectionArray = [
        images.nft_image_1,
        images.nft_image_2,
        images.nft_image_3,
        images.nft_image_1,
        images.nft_image_2,
        images.nft_image_3,
        images.nft_image_1,
        images.nft_image_2,
      ]; */

  return (
    <div className={Style.collection}>
      <Banner bannerImage={images.creatorbackground1} />
      <CollectionProfile/>
      <Filter />
      <NFTCardTwo NFTData = {nfts}/>
      <Slider />
      <Brand />
    </div>
  )
}

export default collection