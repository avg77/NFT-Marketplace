import React, {useState} from 'react'
import Style from "./AudioCardSmall.module.css"
import Image from 'next/image'
import images from "../../../img"
import { LikeProfile } from '../../componentsindex'
import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb";

const AudioCardSmall = () => {
    const [play, setPlay] = useState(false);

    const playMusic = () => {
      if (!play) {
        setPlay(true);
      } else {
        setPlay(false);
      }
    };
    return (
      <div className={Style.audioPlayer}>
        <div className={Style.audioPlayer_box}>
          <Image
            src={images.creatorbackground1}
            alt="music"
            width={100}
            height={100}
            className={Style.audioPlayer_box_img}
          />
  
          <div className={Style.audioPlayer_box_info}>
            <h4>NFT music #1142</h4>
            <div className={Style.audioPlayer_box_info_box}>
                <LikeProfile/>
              <div className={Style.audioPlayer_box_info_box_price}>
                <small>Price</small>
                <p>1 ETH</p>
              </div>
            </div>
          </div>
  
          <div
            className={Style.audioPlayer_box_playBtn}
            onClick={() => playMusic()}
          >
            {play ? <TbPlayerPause /> : <TbPlayerPlay />}
          </div>
        </div>
      </div>
    );
}

export default AudioCardSmall