import React from 'react'
import Style from "./SliderCard.module.css"
import {motion} from "framer-motion"
import Image from 'next/image'
import images from "../../../img"
import { LikeProfile } from '../../componentsindex'

const SliderCard = ({el , i}) => {
  return (
    <motion.div className={Style.sliderCard}>
      <div className={Style.sliderCard_box}>
        <motion.div className={Style.sliderCard_box_img}>
          <Image
            src={el.background}
            className={Style.sliderCard_box_img_img}
            alt="slider profile"
            width={342}
            height={250}
            objectFit="cover"
          />
        </motion.div>
        <div className={Style.sliderCard_box_title}>
          <p>NFT Video #1245</p>
          <div className={Style.sliderCard_box_title_like}>
            {/* <LikeProfile /> */}
            <small>1 of 100</small>
          </div>
        </div>

        <div className={Style.sliderCard_box_price}>
          <div className={Style.sliderCard_box_price_box}>
            <small>Current Bid</small>
            <p>1.000 ETH</p>
          </div>

          <div className={Style.sliderCard_box_price_time}>
            <small>Remaining time</small>
            <p>3h : 15m : 20s</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SliderCard