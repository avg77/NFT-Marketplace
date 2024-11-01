import React, {useState, useMemo, useCallback, useContext} from 'react'
import Style from "../styles/account.module.css"
import Form from '../AccountPage/Form/Form'
import Image from 'next/image'
import images from "../img"
import {useDropzone} from "react-dropzone"

const account = () => {
    const [fileUrl, setFileUrl] = useState(null);

    const onDrop = useCallback(async (acceptedFile) => {
      setFileUrl(acceptedFile[0]);
    }, []);
  
    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: "image/*",
      maxSize: 5000000,
    });
  
    return (
      <div className={Style.account}>
        <div className={Style.account_info}>
          <h1>Profile settings</h1>
          <p>
            You can set preferred display name, create your profile URL and manage
            other personal settings.
          </p>
        </div>
  
        <div className={Style.account_box}>
          <div className={Style.account_box_img} {...getRootProps()}>
            <input {...getInputProps()} />
            <Image
              src={images.user1}
              alt="account upload"
              width={100}
              height={100}
              className={Style.account_box_img_img}
            />
            <p className={Style.account_box_img_para}>Change Image</p>
          </div>
          <div className={Style.account_box_from}>
            <Form/>
          </div>
        </div>
      </div>
    );
}

export default account