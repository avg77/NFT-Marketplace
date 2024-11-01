// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.0015 ether;

    address payable owner;

    mapping(uint256 => MarketItem) private idMarketItem;

    // roles defined:
    // 1) Owner of the marketplace
    // 2) Buyer
    // 3) Seller
    // 4) Marketplace contract

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable originalMinter;
        uint256 price;
        bool ifSold;
    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool ifSold
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "You are not the owner of the marketplace!"
        );
        _;
    }

    constructor() ERC721("NFT Metaverse Token", "MYNFT") {
        owner = payable(msg.sender);
    }

    function updateListingPrice(
        uint256 _ListingPrice
    ) public payable onlyOwner {
        listingPrice = _ListingPrice;
    }

    function fetchListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function fetchOriginalMinter(
        uint256 tokenId
    ) public view returns (address) {
        return idMarketItem[tokenId].originalMinter;
    }

    // role: seller -> (mint a new nft)
    function mintNFT(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();       // new token id generated to uniquely identify the nft

        _mint(msg.sender, newTokenId);                  // assigns the newly generated token id to the seller
        _setTokenURI(newTokenId, tokenURI);             // takes the initial token uri (metadata) and associates itself with the newly generated token id above

        listNFTForSale(newTokenId, price);

        return newTokenId;
    }

    // role: seller -> (list the nft on marketplace)
    function listNFTForSale(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be greater than zero!");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price!"
        );

        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),      // the contract becomes the owner temporarily until the nft gets sold
            payable(msg.sender),         // original minter/owner of the nft
            price,
            false                        // remains false initially as the nft is unsold
        );

        _transfer(msg.sender, address(this), tokenId);     // transfers the token id ownership from seller to contract

        emit idMarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    // role: seller -> (re-list the nft to sell at a different price amount)
    // works for 2 scenarios: re-selling after buying and updating the price while still unsold

    function reListNFTForSale(uint256 tokenId, uint256 price) public payable {
        require(
            idMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation!"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price!"
        ); // need to pay the listing price amount every time you re-sell or re-list

        // only decrement _itemsSold if the nft was sold previously
        if (idMarketItem[tokenId].ifSold == true) {
            _itemsSold.decrement();
        }

        idMarketItem[tokenId].ifSold = false; // mark it as unsold again
        idMarketItem[tokenId].price = price;
        idMarketItem[tokenId].seller = payable(msg.sender);
        idMarketItem[tokenId].owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);
    }

    //role: buyer -> (purchase an nft)
    function purchaseNFT(uint256 tokenId) public payable {
        uint256 price = idMarketItem[tokenId].price;

        require(
            msg.value == price,
            "Mention amount equal to the price to complete the purchase!"
        );

        idMarketItem[tokenId].owner = payable(msg.sender);            // function caller (buyer) becomes the new owner after buying the nft
        idMarketItem[tokenId].ifSold = true;

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);                // transfers the token id ownership from contract to the buyer (new owner)

        payable(owner).transfer(listingPrice);                        // the owner of the marketplace receives amount equal to listing price
        payable(idMarketItem[tokenId].seller).transfer(msg.value);    // the seller of the nft receives amount equal to the purchase amount
    }

    // role: anyone (public) -> (displays unsold nft data on marketplace)
    function fetchUnsoldNFTs() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current(); // total count of nfts listed on marketplace (sold and unsold included)
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0; // to access newly created array below

        MarketItem[] memory items = new MarketItem[](unsoldItemCount); // newly created array 'items' of struct 'MarketItem' with size equal to 'unsoldItemCount'
        for (uint256 i = 0; i < itemCount; i++) {
            // iteration over all the nfts
            if (idMarketItem[i + 1].owner == address(this)) {
                // nfts currently existing on marketplace meaning unsold nfts ([i+1] because nft token ids start from 1)
                uint256 currentId = i + 1; // stores the token id of the current nft being evaluated

                MarketItem storage currentItem = idMarketItem[currentId];       // new 'currentItem' variable of struct type 'MarketItem' stored in the mapping allows for direct manipulation
                items[currentIndex] = currentItem;                              // assigns 'currentItem' data (unsold nfts) to newly created 'items' array which will then be accessible by calling array index starting from 0,1,2,3....and so on
                currentIndex += 1;
            }
        }
        return items; // displays unsold nfts
    }

    // role: nft owner -> (displays nfts owned by the nft owner)
    function fetchOwnedNFTs() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0; // for keeping track of number of nfts owned by the nft owner
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                // function caller (nft owner)
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // role: nft seller -> (displays all the nfts currently listed for sale by the nft seller)
    function fetchListedNFTs() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                // function caller (nft seller)
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}

