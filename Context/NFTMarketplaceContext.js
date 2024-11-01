require("dotenv").config();
import React, {useState, useEffect, useContext} from 'react'
import web3Modal from "web3modal";
import {ethers} from "ethers";
import Router from "next/router";
import axios from "axios";
import {create as ipfsHttpClient} from "ipfs-http-client";

import { NFTMarketplaceAddress, NFTMarketplaceABI } from './constants';
import { useRouter } from 'next/navigation';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY

const fetchContract = (signerOrProvider) => new ethers.Contract(NFTMarketplaceAddress, NFTMarketplaceABI, signerOrProvider);

const connectingWithSmartContract = async() => {
    try {
        const Web3Modal = new web3Modal();
        const connection = await Web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);
        return contract;
    } 
    catch (error) {
      console.log("Something went wrong while connecting with contract", error);
    }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = (({children}) => {


const [error, setError] = useState("");
const [openError, setOpenError] = useState(false);
const [currentAccount, setCurrentAccount] = useState("");
const [accountBalance, setAccountBalance] = useState("");
const router = useRouter();

const checkIfWalletConnected = async() => {
    try {
       if(!window.ethereum)
        return console.log("MetaMask is not installed!")
    
       const accounts = await window.ethereum.request({
        method: "eth_accounts"
       });

       if(accounts.length){
        setCurrentAccount(accounts[0]);
       }
       else{
        console.log("Account not found!")
       }
    } 
    catch (error) {
        console.log("Something went wrong while connecting to wallet")
    }
}

useEffect(() => {
    checkIfWalletConnected();
}, []) 

const connectWallet = async() => {
    try {
        if(!window.ethereum)
         return console.log("MetaMask is not installed!")
     
        const accounts = await window.ethereum.request({
         method: "eth_requestAccounts"
        });

        setCurrentAccount(accounts[0])
        //window.location.reload()
    }
    catch(error){
        console.log("Error while connecting to wallet!")
    }
}

const uploadToPinata = async(file) => {
    if(file){
        try{
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: `${PINATA_API_KEY}`,
                    pinata_secret_api_key: `${PINATA_SECRET_API_KEY}`,
                    "Content-Type": "multipart/form-data",
                },
                
            });
            
            const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            return ImgHash;
        }
        catch(error){
            console.log("Unable to upload image to Pinata!")
        }

    }
}

const createNFT = async(name, price, image, description, router) => {
    if(!name || !description || !price || !image)
        return setError("Data is missing!"), setOpenError(true);

    const data = JSON.stringify({name, description, image});

    try {
        const response = await axios({
            method: "POST",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data: data,
            headers: {
                pinata_api_key: `${PINATA_API_KEY}`,
                pinata_secret_api_key: `${PINATA_SECRET_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        console.log(url);

        await createSale(url, price);
        router.push("/searchPage");
    }
    catch(error){
        setError("Error while creating NFT!");
        setOpenError(true);
    }
};

const createSale = async(url, formInputPrice, isReselling, id) => {
    try{
        const price = ethers.utils.parseUnits(formInputPrice, "ether");
        const contract = await connectingWithSmartContract()

        const listingPrice = await contract.fetchListingPrice()

        const transaction = !isReselling ? await contract.mintNFT(url, price, {
            value: listingPrice.toString(),
        }) : 
        await contract.reListNFTForSale(id, price, {
            value: listingPrice.toString(),
        })

        await transaction.wait()
        
    }
    catch(error) {
        console.log("Error while creating sale!");
    }
}
   
const purchaseNFT = async(nft) => {
    try {
       const contract = await connectingWithSmartContract();
       const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
       
       const transaction = await contract.purchaseNFT(nft.tokenId, {
        value: price,
       });

       await transaction.wait()
       router.push("/author")
    } catch (error) {
       console.log("Error while buying NFT!") 
    }
}

const fetchUnsoldNFTs = async() => {
    try {
       const provider = new ethers.providers.JsonRpcProvider();
       const contract = fetchContract(provider);
       
       const data = await contract.fetchUnsoldNFTs();

       const items = await Promise.all(
        data.map(
            async({tokenId, seller, owner, price: unformattedPrice}) => {
            const tokenURI = await contract.tokenURI(tokenId)

            const {
                data: {image, name, description},
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice.toString(), "ether");

            return {price, tokenId: tokenId.toNumber(), seller, owner, image, name, description, tokenURI}
         }
        )
       )
       return items;
    } 
    catch (error) {
       console.log("Error while fetching NFTs"); 
    }
}

useEffect(() => {
    fetchUnsoldNFTs()
}, [])

const fetchOwnedOrListedNFTs = async(type) => {
    try {
        const contract = await connectingWithSmartContract();

        const data = type == "fetchListedNFTs" ? await contract.fetchListedNFTs() :
        await contract.fetchOwnedNFTs()

        const items = Promise.all(
            data.map(
            async({tokenId, seller, owner, price: unformattedPrice}) => {
                const tokenURI = await contract.tokenURI(tokenId)
                const {
                    data: {image, name, description}
                } = await axios.get(tokenURI);
                 const price = ethers.utils.formatUnits(
                    unformattedPrice.toString(),
                    "ether"
                 );

                 return{price, tokenId: tokenId.toNumber(), seller, owner, image, name, description, tokenURI}
            }
        )
    )
    return items;
    } catch (error) {
        console.log("Error while fetching listed NFTs!")
    }
}

useEffect(() => {
    fetchOwnedOrListedNFTs()
}, [])

    return (
        <NFTMarketplaceContext.Provider value={
            { checkIfWalletConnected, connectWallet, uploadToPinata, createNFT, createSale, purchaseNFT, fetchUnsoldNFTs, fetchOwnedOrListedNFTs, error, openError, accountBalance, currentAccount, router}}>
            {children}
        </NFTMarketplaceContext.Provider>
    )
})