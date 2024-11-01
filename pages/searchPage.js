import React, {useEffect, useState, useContext} from 'react'
import Style from "../styles/searchPage.module.css"
import {Slider, Brand, Filter} from "../components/componentsindex"
import { SearchBar } from '../searchPage/searchBarIndex'
import {NFTCardTwo, Banner} from "../collectionPage/collectionindex"
import images from "../img"

import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const searchPage = () => {
    const {fetchUnsoldNFTs} = useContext(NFTMarketplaceContext)
    const [nfts, setNfts] = useState([]);
    const [nftsCopy, setNftsCopy] = useState([])

    useEffect(() => {
      fetchUnsoldNFTs().then((item) => {
        setNfts(item.reverse())
        setNftsCopy(item)
      })
    }, [])

    const onHandleSearch = (value) => {
      const filteredNFTs = nfts.filter(({name}) => name.toLowerCase().includes(value.toLowerCase())
    )

    if(filteredNFTs.length === 0){
      setNfts(nftsCopy);
    }
    else{
      setNfts(filteredNFTs)
    }
  }

const onClearSearch = () => {
  if(nfts.length && nftsCopy.length){
    setNfts(nftsCopy)
  }
}

   /*  const collectionArray = [
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
        <div className={Style.searchPage}>
          <Banner bannerImage={images.creatorbackground2} />
          <SearchBar onHandleSearch={onHandleSearch} onClearSearch={onClearSearch}/>
          <Filter />
          <NFTCardTwo NFTData={nfts} />
          <Slider />
          <Brand />
        </div>
      );
}

export default searchPage