import React, {useContext, useEffect, useState} from 'react'
import Style from "../styles/resellNFT.module.css"
import formStyle from "../AccountPage/Form/Form.module.css"
import axios from "axios"
import {useRouter} from "next/router"
import {Button} from "../components/componentsindex"
import Image from 'next/image'

import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const resellNFT = () => {

    const {createSale} = useContext(NFTMarketplaceContext)
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const router = useRouter();
    const {id, tokenURI} = router.query

    const fetchNFT = async() => {
        if(!tokenURI) return

        const {data} = await axios.get(tokenURI)

        //setPrice(data.price)
        setImage(data.image)

        useEffect(() => {
            fetchNFT()
        }, [id])
    }

        const resell = async() => {
            await createSale(tokenURI, price, true, id)
            router.push("/author")
        }
    

  return (
    <div className={Style.resellNFT}>
        <div className={Style.resellNFT_box}>
            <h1>Resell an NFT</h1>
        <div className={formStyle.Form_box_input}>
            <label htmlFor="name">Price</label>
            <input
              type="number"
              min={1}
              placeholder="Re-sell price"
              className={formStyle.Form_box_input_userName}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className={Style.resellNFT_box_image}>
            {
                image && (<Image src={image} alt='resell nft' width={300} height={300}></Image>)
            }
          </div>

          <div className={Style.resellNFT_box_btn}>
            <Button btnName="Resell NFT" handleClick={() => resell()}/>
          </div>
        </div>
    </div>
  )
}

export default resellNFT