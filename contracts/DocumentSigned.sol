//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract DocumentSigner {
    struct Document {
        uint256 id;
        string content;
        address signer;
        uint256 timestamp;
    }

    mapping(address => Document[]) public userDocuments;
    uint256 private documentCounter;

    event DocumentSigned(uint256 indexed documentId, address indexed signer, string content, uint256 timestamp);

    function signDocument(string memory document) public {
        documentCounter++;
        Document memory newDocument = Document(documentCounter, document, msg.sender, block.timestamp);
        userDocuments[msg.sender].push(newDocument);
        emit DocumentSigned(documentCounter, msg.sender, document, block.timestamp);
    }

    function getMyDocuments() public view returns (Document[] memory) {
        return userDocuments[msg.sender];
    }
}
