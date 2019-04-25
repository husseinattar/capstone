// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

//const Verifier = artifacts.require('Verifier');
//const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

var SquareVerifier = artifacts.require('SquareVerifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');


const proof = require('../../zokrates/code/square/proof.json');
// Test if a new solution can be added for contract - SolnSquareVerifier
contract('SolnSquareVerifier', accounts => {
    //read first account
    const account_one = accounts[0];
    const account_two = accounts[1];

    //read proof json
    const A = proof["proof"]["A"];
    const A_p = proof["proof"]["A_p"];
    const B = proof["proof"]["B"];
    const B_p = proof["proof"]["B_p"];
    const C = proof["proof"]["C"];
    const C_p = proof["proof"]["C_p"];
    const H = proof["proof"]["H"];
    const K = proof["proof"]["K"];
    const correctProofInput = proof["input"];

    let name = "Real Estate MarketPlace";
    let symbol = "NeoMX";
    let baseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('Testing SolnSquareVerifier', function () {
        beforeEach(async function () {
            const square_verifier = await SquareVerifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(square_verifier.address, {from: account_one});
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can) be added for contract - SolnSquareVerifier', async function () {
            let added = await this.contract._addSolution(account_one, 100, A, A_p, B, B_p, C, C_p, H, K, correctProofInput, { from: account_one });
            let event = added.logs[0].event;
            assert.equal("SolutionAdded", event, "Add new solution - Unsuccessful");

        });


        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {

            let minted = await this.contract.mintNFT(account_two, 200, A, A_p, B, B_p, C, C_p, H, K, correctProofInput, { from: account_one });
            let tokenURI = await this.contract.tokenURI.call(200)
            assert.equal(tokenURI,baseURI+200, "Minting unsuccessful");

            let owner = await this.contract.ownerOf(200);
            assert.equal(owner,account_two, "Minting Owner correct");
        });
    });
});

