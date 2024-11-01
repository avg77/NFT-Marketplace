import React, { useState, useContext, useEffect } from "react";
import Style from "../styles/index.module.css";
import {
  HeroSection,
  Service,
  BigNFTSlider,
  Subscribe,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  FollowerTab,
  AudioLive,
  Slider,
  Brand,
} from "../components/componentsindex";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Home = () => {
  const {checkIfWalletConnected} = useContext(NFTMarketplaceContext)

  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  const {fetchUnsoldNFTs} = useContext(NFTMarketplaceContext)
    const [nfts, setNfts] = useState([]);
    const [nftsCopy, setNftsCopy] = useState([])

    useEffect(() => {
      fetchUnsoldNFTs().then((item) => {
        setNfts(item.reverse())
        setNftsCopy(item)
      })
    }, [])

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />  
      <Title
        heading="Audio Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <AudioLive/>   
      <FollowerTab/>
      <Slider/>
      <Collection/>
      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />
      <NFTCard NFTData={nfts}/>
      <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category />
      <Subscribe />
      <Brand/>
    </div>
  );

};

export default Home;
