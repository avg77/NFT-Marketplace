import React from 'react'
import Style from "../styles/about.module.css"
import { Brand } from '../components/componentsindex'
import Image from 'next/image'
import images from "../img"

const about = () => {
    const founderArray = [
        {
          name: "Niamh O'Shea",
          position: "Co-founder and Chief Executive",
          images: images.founder1,
        },
        {
          name: "Danien Jame",
          position: "Co-founder and Chief Executive",
          images: images.founder2,
        },
        {
          name: "Orla Dwyer",
          position: "Co-founder, Chairman",
          images: images.founder3,
        },
        {
          name: "Dara Frazier",
          position: "Chief Strategy Officer",
          images: images.founder4,
        },
      ];
    
      const factsArray = [
        {
          title: "1 million",
          info: "Articles have been public around the world (as of Sept. 30, 2024)",
        },
        {
          title: "100,000",
          info: "Registered users account (as of Sept. 30, 2024)",
        },
        {
          title: "220+",
          info: "Countries and regions have our presence (as of Sept. 30, 2024",
        },
      ];
      return (
        <div className={Style.aboutus}>
          <div className={Style.aboutus_box}>
            <div className={Style.aboutus_box_hero}>
              <div className={Style.aboutus_box_hero_left}>
                <h1>👋 About Us.</h1>
                <p>
                  We’re impartial and independent, and every day we create
                  distinctive, world-class programmes and content which inform,
                  educate and entertain millions of people in the around the world.
                </p>
              </div>
              <div className={Style.aboutus_box_hero_right}>
                <Image src={images.hero2} />
              </div>
            </div>
    
            <div className={Style.aboutus_box_title}>
              <h2>⛱ Founders</h2>
              <p>
                We’re impartial and independent, and every day we create
                distinctive, world-class programmes and content
              </p>
            </div>
    
            <div className={Style.aboutus_box_founder}>
              <div className={Style.aboutus_box_founder_box}>
                {founderArray.map((el, i) => (
                  <div className={Style.aboutus_box_founder_box_img}>
                    <Image
                      src={el.images}
                      alt={el.name}
                      width={270}
                      height={250}
                      className={Style.aboutus_box_founder_box_img_img}
                    />
                    <h3>{el.name}</h3>
                    <p>{el.position}</p>
                  </div>
                ))}
              </div>
            </div>
    
            <div className={Style.aboutus_box_title}>
              <h2>🚀 Fast Facts</h2>
              <p>
                We’re impartial and independent, and every day we create
                distinctive, world-class programmes and content
              </p>
            </div>
    
            <div className={Style.aboutus_box_facts}>
              <div className={Style.aboutus_box_facts_box}>
                {factsArray.map((el, i) => (
                  <div className={Style.aboutus_box_facts_box_info}>
                    <h3>{el.title}</h3>
                    <p>{el.info}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Brand />
        </div>
      );
}

export default about