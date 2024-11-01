import React from 'react'
import Style from "./Brand.module.css"
import Image from 'next/image'
import images from "../../img"
import { Button } from '../componentsindex'
import { useRouter } from 'next/router'

const Brand = () => {
  const router = useRouter()
    return (
        <div className={Style.Brand}>
          <div className={Style.Brand_box}>
            <div className={Style.Brand_box_left}>
              <Image src={images.logo} alt="brand logo" width={100} height={100} />
              <h2>Earn free crypto with Cicryp</h2>
              <p>A creative agency that lead and inspire.</p>
    
              <div className={Style.Brand_box_left_btn}>
                <Button btnName="Create" handleClick={() => router.push("/uploadNFT")} />
                <Button btnName="Earn" handleClick={() => {}} />
              </div>
            </div>
            <div className={Style.Brand_box_right}>
              <Image src={images.earn} alt="brand logo" width={650} height={400} />
            </div>
          </div>
        </div>
      );
}

export default Brand