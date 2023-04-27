// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract StreamYou is ERC1155 {

    address private owner;

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    struct channelInfo {
        EnumerableSet.UintSet tokenIds;
        address channelOwner;
    }

    struct tokenInfo {
        address creator;
        uint256 price;
        string metadataURI;
        string channelName;
    }


    uint256 private channelCreationFee;

    Counters.Counter private _tokenIds;

    mapping(string => channelInfo) private _channelInfo;
    mapping(uint256 => tokenInfo) private _tokenInfo;


    constructor() ERC1155(""){
        owner = msg.sender;
        channelCreationFee = 0.01 ether;
    }

    // @notice Creates a new channel
    // @param channelName The name of the channel
    function createChannel(string memory channelName) public payable {
        require(msg.value >= channelCreationFee, "Not enough funds to create channel");
        require(_channelInfo[channelName].channelOwner == address(0), "Channel already exists");
        _channelInfo[channelName].channelOwner = msg.sender;
    }

    // @notice Creates a new token
    // @param channelName The name of the channel
    // @param price The price of the token
    // @param currentToken The current token id
    function createToken(string memory channelName, string memory metadataUri, uint256 price, uint256 currentToken) public {
        require(_channelInfo[channelName].channelOwner == msg.sender, "You are not the owner of this channel");
        require(currentToken == _tokenIds.current() + 1);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _channelInfo[channelName].tokenIds.add(newItemId);
        _tokenInfo[newItemId].creator = msg.sender;
        _tokenInfo[newItemId].price = price;
        _tokenInfo[newItemId].metadataURI = metadataUri;
        _tokenInfo[newItemId].channelName = channelName;
    }

    // @notice Mints a token
    // @param tokenId The id of the token
    function mint(uint256 tokenId) public payable {
        exists(tokenId);
        require(msg.value >= _tokenInfo[tokenId].price, "Not enough funds to mint token");
        require(balanceOf(msg.sender, tokenId) == 0, "You already own this token");
        address payable creator = payable(_tokenInfo[tokenId].creator);
        creator.transfer(msg.value);
        _mint(msg.sender, tokenId, 1, "");
    }

    // @notice Overriding the uri function of ERC1155
    // @param tokenId The id of the token
    // @return The uri of the token
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        exists(tokenId);
        return _tokenInfo[tokenId].metadataURI;
    }

    function exists(uint256 tokenId) internal view{
        if(tokenId > _tokenIds.current()){ revert();}
    }

    // @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }

    // @notice returns the array of token ids of a channel
    function getChannelTokens(string memory channelName) public view returns(uint[] memory){
        uint[] memory tokens = new uint[](_channelInfo[channelName].tokenIds.length());
        for(uint i = 0; i < _channelInfo[channelName].tokenIds.length(); i++){
            tokens[i] = _channelInfo[channelName].tokenIds.at(i);
        }
        return tokens;
    }

    // @notice returns the owner of a channel
    function getChannelOwner(string memory channelName) public view returns(address){
        return _channelInfo[channelName].channelOwner;
    }

    // @notice return the creator of a token
    function getTokenCreator(uint256 tokenId) public view returns(address){
        return _tokenInfo[tokenId].creator;
    }

    // @notice return the price of a token
    function getTokenPrice(uint256 tokenId) public view returns(uint256){
        return _tokenInfo[tokenId].price;
    }

    // @notice return the channel name of a token
    function getTokenChannelName(uint256 tokenId) public view returns(string memory){
        return _tokenInfo[tokenId].channelName;
    }

    // @notice return the metadata uri of a token
    function getTokenMetadataURI(uint256 tokenId) public view returns(string memory){
        return _tokenInfo[tokenId].metadataURI;
    }

    function getChannelCreationFee() public view returns(uint256){
        return channelCreationFee;
    }

    function setChannelCreationFee(uint256 newFee) public {
        require(msg.sender == owner, "You are not the owner of this contract");
        channelCreationFee = newFee;
    }

    function withdraw() public {
        require(msg.sender == owner, "You are not the owner of this contract");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    function getOwner() public view returns(address){
        return owner;
    }
}
