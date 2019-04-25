
pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/utils/Address.sol';
import './ERC721Mintable.sol';
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <SquareVerifier>
contract SquareVerifier is Verifier{

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is NeomXERC721Token {
    

//Verifier variable 
SquareVerifier public _verifier;

    constructor (address verifier_address) public {
        _verifier = SquareVerifier(verifier_address);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address to;
    }


    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address to, uint256 index);
    event VerifierChanged(address newVerifier);



    // TODO Create a function to add the solutions to the array and emit the event
    function _addSolution(
            address to,
            uint256 tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input) public {
        
        //Encode solution 
        bytes32 key = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));

        //Store solution for later
        Solution storage solution = solutions[key];

        //Set Solution struct variable 
        solution.index = tokenId;
        solution.to = msg.sender;

        //Emit event after solution as been added
        emit SolutionAdded(to, tokenId);
    }


    function setVerifier(address verifier_address) public onlyOwner {
        
        // make sure the new verifier is a contract
        require(Address.isContract(verifier_address), "Caller is not contract owner");

        // set new verifier
        _verifier = SquareVerifier(verifier_address);

        // emit verifier changed event
        emit VerifierChanged(verifier_address);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
        function mintNFT(
            address to,
            uint256 tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input) public {
            
            //Verify solution
            //require(_verifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "Wrong Solution");

            //Encode solution to check for uniqness 
            bytes32 key = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));

            //Check if solution in solution Array 
            require(solutions[key].to == address(0), "Solution already existed");

            //Add Solution
            _addSolution(to, tokenId, a, a_p, b, b_p, c, c_p, h, k, input);

            //Mint Token
            super.mint(to, tokenId, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
        }
        
    }

