
//Import correct contracts 
var SquareVerifier = artifacts.require('SquareVerifier');
var ERC721MintableComplete = artifacts.require('SolnSquareVerifier');

contract('TestERC721Mintable', accounts => {

    //Create accounts
    const account_one = accounts[0];
    const account_two = accounts[1];

    //Setup contract details 
    let name = "Real Estate MarketPlace";
    let symbol = "NeoMX";
    let baseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";


    describe('match erc721 spec', function () {
        
        //Establish before testing 
        beforeEach(async function () {

            //Setup contracts 
            const squareVerifier = await SquareVerifier.new({from: account_one});
            this.contract = await ERC721MintableComplete.new(squareVerifier.address, {from: account_one});

            //Mint 5 tokens 
            await this.contract.mint(account_one, 1, baseURI);
            await this.contract.mint(account_one, 2, baseURI);
            await this.contract.mint(account_one, 3, baseURI);
            await this.contract.mint(account_one, 4, baseURI);
            await this.contract.mint(account_one, 5, baseURI);

        });

        //Test total supply 
        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, 5  , "Wrong Total Supply");
        })

        //Test get token Balance 
        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf.call(account_one);
            assert.equal(tokenBalance, 5 , "Wrong Token Balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let givenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            let tokenURI = await this.contract.tokenURI.call(1);
            assert.equal(tokenURI, givenURI, "Token URI not matching   ");
        })
/*
        //Transfer token from one address to another 
        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 2);
            let newOwner = await this.contract.ownerOf.call(2);
            assert.equal(newOwner, account_two, "Transfer operation does not work");
        })
        */
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            
          const square_verifier = await SquareVerifier.new({from: account_one});
          this.contract = await ERC721MintableComplete.new(square_verifier.address, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            //Test Results of minting 
            let result = true;
            try {
                await this.contract.mint(account_two, 6);
            } catch (err) {
                result = false;
            }               
            assert.equal(result, false, "Mint operation worked without being an owner");
        })

        it('should return contract owner', async function () { 
            let currentOwner = await this.contract.getOwner();
            assert.equal(currentOwner, account_one, "Owner is different from contract owner");
        })

    });
})
