const { expect, assert } = require("chai");
const truffleAssert = require('truffle-assertions');
const { increaseTime } = require('./utils/timeManipulation');
const { mintERC20Tokens } = require('./utils/mintERC20Tokens');

// ********************************************************************************
// ****** Should be uncomment accounts in Participants contract before tests ******
// ********************************************************************************

const bn1e18 = ethers.BigNumber.from((10**18).toString());
const timestamp = 1646092800; // 1 Mar.

const oneMonth = 2592000;
const sixMonthPass = 1661644800;
const nineMonthPass = 1669420800;
const twelveMonthPass = 1677196800;
const eighteenMonthPass = 1692748800;
const twentyFourMonthPass = 1708300800;

let owner;
let payer1;
let payer2;
let payer3;
let payer4;

let crowdsaleVesting;
let ddaoToken;
let addaoToken;

describe("CrowdsaleVesting", function () {

    beforeEach(async function() {
        [owner, payer1, payer2, payer3, payer4] = await ethers.getSigners();

        CrowdsaleVesting = await ethers.getContractFactory('CrowdsaleVesting');
        ERC20 = await ethers.getContractFactory('ERC20Base');

        ddaoToken = await ERC20.deploy('DEFI HUNTERS DAO Token', 'DDAO', 18);
        await ddaoToken.mint(owner.address, '21000000000000000000000000');
        
        addaoToken = await ERC20.deploy('DEFI HUNTERS DAO Token', 'aDDAO', 18);
        await addaoToken.mint(owner.address, '5880000000000000000000000');
        
        crowdsaleVesting = await CrowdsaleVesting.deploy(ddaoToken.address, addaoToken.address)
        
        await ddaoToken.transfer(crowdsaleVesting.address, '5880000000000000000000000');

        await mintERC20Tokens(ddaoToken);
        await mintERC20Tokens(addaoToken);
    })

    describe("claim", function() {
        it("Should not claim as balance 0.", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer2).claim(0), "CrowdsaleVesting: Nothing to claim");
        });
        it("Should not calculate. Round 100 isn't exist", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer2).claim(100), "CrowdsaleVesting: This round has not supported");
        });
    })
    
    describe("calculateUnlockedTokens", function() {
        it("Should not calculate. Round 100 isn't exist", async function() {
            await truffleAssert.reverts(crowdsaleVesting.calculateUnlockedTokens(payer1.address, 100, 0), "CrowdsaleVesting: This round has not supported");
        });
        it("Should be able to calculate even does not participate in rounds", async function() {
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 0, 1648684800)).toString()).to.be.equal('26041666666666666666666');
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 1, 1648684800)).toString()).to.be.equal('0');
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 2, 1648684800)).toString()).to.be.equal('0');
        });
        it("Should return 0 as timestamp less than start date", async function() {
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 2, timestamp - 1)).toString()).to.be.equal('0');
        });

        describe("Rounds | Should be [x] tokens available to claim in [t]", function() {
            
            //================= 1 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b, a: 156250000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b';
                const a = '156250000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 2 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b, a: 312500000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b';
                const a = '312500000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 3 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b, a: 468750000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b';
                const a = '468750000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 4 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b, a: 625000000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0xECCFbC5B04Da35D611EF8b51099fA5Bc6639d73b';
                const a = '625000000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 5 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0x7777420DD0E5f0E13D51C831f77495a057aaBBBB, a: 83125000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7777420DD0E5f0E13D51C831f77495a057aaBBBB';
                const a = '83125000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 6 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x7777420DD0E5f0E13D51C831f77495a057aaBBBB, a: 166250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7777420DD0E5f0E13D51C831f77495a057aaBBBB';
                const a = '166250000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 7 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0x7777420DD0E5f0E13D51C831f77495a057aaBBBB, a: 249375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x7777420DD0E5f0E13D51C831f77495a057aaBBBB';
                const a = '249375000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 8 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7777420DD0E5f0E13D51C831f77495a057aaBBBB, a: 332500000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0x7777420DD0E5f0E13D51C831f77495a057aaBBBB';
                const a = '332500000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 9 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB, a: 78125000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB';
                const a = '78125000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 10 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB, a: 156250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB';
                const a = '156250000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 11 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB, a: 234375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB';
                const a = '234375000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 12 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB, a: 312500000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0xEB2d2F1b8c558a40207669291Fda468E50c8A0bB';
                const a = '312500000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 13 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198, a: 78125000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198';
                const a = '78125000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 14 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198, a: 156250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198';
                const a = '156250000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 15 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198, a: 234375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198';
                const a = '234375000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 16 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198, a: 312500000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0x8595f8141E90fcf6Ee17C85142Fd03d3138A6198';
                const a = '312500000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 17 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0xCf57A3b1C076838116731FDe404492D9d168747A, a: 78125000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xCf57A3b1C076838116731FDe404492D9d168747A';
                const a = '78125000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 18 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xCf57A3b1C076838116731FDe404492D9d168747A, a: 156250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xCf57A3b1C076838116731FDe404492D9d168747A';
                const a = '156250000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 19 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0xCf57A3b1C076838116731FDe404492D9d168747A, a: 234375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xCf57A3b1C076838116731FDe404492D9d168747A';
                const a = '234375000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 20 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xCf57A3b1C076838116731FDe404492D9d168747A, a: 312500000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0xCf57A3b1C076838116731FDe404492D9d168747A';
                const a = '312500000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 21 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5, a: 78125000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5';
                const a = '78125000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 22 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5, a: 156250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5';
                const a = '156250000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 23 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5, a: 234375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5';
                const a = '234375000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 24 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5, a: 312500000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0x07587c046d4d4BD97C2d64EDBfAB1c1fE28A10E5';
                const a = '312500000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 25 2022-08-28 00:00:00 ====== [250000000000000000] = 0.25 =========
            it("wallet: 0x5555DADcb41fB48934b02A0DBF793b97541F7777, a: 78125000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x5555DADcb41fB48934b02A0DBF793b97541F7777';
                const a = '78125000000000000000000';
                const t = 1661644800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 26 2023-02-24 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x5555DADcb41fB48934b02A0DBF793b97541F7777, a: 156250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x5555DADcb41fB48934b02A0DBF793b97541F7777';
                const a = '156250000000000000000000';
                const t = 1677196800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 27 2023-08-23 00:00:00 ====== [750000000000000000] = 0.75 =========
            it("wallet: 0x5555DADcb41fB48934b02A0DBF793b97541F7777, a: 234375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x5555DADcb41fB48934b02A0DBF793b97541F7777';
                const a = '234375000000000000000000';
                const t = 1692748800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 28 2024-02-19 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x5555DADcb41fB48934b02A0DBF793b97541F7777, a: 312500000000000000000000, t: 2024-02-19 00:00:00 (1708300800)", async function() { 
                const wallet = '0x5555DADcb41fB48934b02A0DBF793b97541F7777';
                const a = '312500000000000000000000';
                const t = 1708300800;
            const r = 0;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 29 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x0026Ec57900Be57503Efda250328507156dAC982, a: 31250000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x0026Ec57900Be57503Efda250328507156dAC982';
                const a = '31250000000000000000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 30 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x0026Ec57900Be57503Efda250328507156dAC982, a: 62500000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x0026Ec57900Be57503Efda250328507156dAC982';
                const a = '62500000000000000000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 31 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x0026Ec57900Be57503Efda250328507156dAC982, a: 93750000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x0026Ec57900Be57503Efda250328507156dAC982';
                const a = '93750000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 32 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xd53b873683Df491553eea6a069770144Ad30F3A9, a: 31250000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xd53b873683Df491553eea6a069770144Ad30F3A9';
                const a = '31250000000000000000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 33 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xd53b873683Df491553eea6a069770144Ad30F3A9, a: 62500000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xd53b873683Df491553eea6a069770144Ad30F3A9';
                const a = '62500000000000000000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 34 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xd53b873683Df491553eea6a069770144Ad30F3A9, a: 93750000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xd53b873683Df491553eea6a069770144Ad30F3A9';
                const a = '93750000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 35 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x7701E5Bf2D8aE221f23F460FE73420eeE86d2872, a: 26041666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7701E5Bf2D8aE221f23F460FE73420eeE86d2872';
                const a = '26041666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 36 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x7701E5Bf2D8aE221f23F460FE73420eeE86d2872, a: 52083333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7701E5Bf2D8aE221f23F460FE73420eeE86d2872';
                const a = '52083333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 37 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7701E5Bf2D8aE221f23F460FE73420eeE86d2872, a: 78125000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x7701E5Bf2D8aE221f23F460FE73420eeE86d2872';
                const a = '78125000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 38 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x1A72CCE42499361FFF103855F845B8cFc1c25b67, a: 20833333333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x1A72CCE42499361FFF103855F845B8cFc1c25b67';
                const a = '20833333333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 39 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x1A72CCE42499361FFF103855F845B8cFc1c25b67, a: 41666666666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x1A72CCE42499361FFF103855F845B8cFc1c25b67';
                const a = '41666666666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 40 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x1A72CCE42499361FFF103855F845B8cFc1c25b67, a: 62500000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x1A72CCE42499361FFF103855F845B8cFc1c25b67';
                const a = '62500000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 41 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x1b9E791f3259dcEF7D1e366b33F644841c2461a5, a: 20833333333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x1b9E791f3259dcEF7D1e366b33F644841c2461a5';
                const a = '20833333333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 42 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x1b9E791f3259dcEF7D1e366b33F644841c2461a5, a: 41666666666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x1b9E791f3259dcEF7D1e366b33F644841c2461a5';
                const a = '41666666666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 43 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x1b9E791f3259dcEF7D1e366b33F644841c2461a5, a: 62500000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x1b9E791f3259dcEF7D1e366b33F644841c2461a5';
                const a = '62500000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 44 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x4E560A3ecfe9E5386E727c76f6e2690aE7a1Bc82, a: 19479166666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x4E560A3ecfe9E5386E727c76f6e2690aE7a1Bc82';
                const a = '19479166666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 45 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x4E560A3ecfe9E5386E727c76f6e2690aE7a1Bc82, a: 38958333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x4E560A3ecfe9E5386E727c76f6e2690aE7a1Bc82';
                const a = '38958333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 46 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x4E560A3ecfe9E5386E727c76f6e2690aE7a1Bc82, a: 58437500000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x4E560A3ecfe9E5386E727c76f6e2690aE7a1Bc82';
                const a = '58437500000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 47 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xCeeA2d354c6357ed7e10e629bd2734119A5B3c21, a: 16117057228020667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xCeeA2d354c6357ed7e10e629bd2734119A5B3c21';
                const a = '16117057228020667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 48 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xCeeA2d354c6357ed7e10e629bd2734119A5B3c21, a: 32234114456041333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xCeeA2d354c6357ed7e10e629bd2734119A5B3c21';
                const a = '32234114456041333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 49 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xCeeA2d354c6357ed7e10e629bd2734119A5B3c21, a: 48351171684062000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xCeeA2d354c6357ed7e10e629bd2734119A5B3c21';
                const a = '48351171684062000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 50 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x98BCE99aa50CB33eca0dDcb2a04404B80dEd3F3E, a: 15625000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x98BCE99aa50CB33eca0dDcb2a04404B80dEd3F3E';
                const a = '15625000000000000000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 51 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x98BCE99aa50CB33eca0dDcb2a04404B80dEd3F3E, a: 31250000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x98BCE99aa50CB33eca0dDcb2a04404B80dEd3F3E';
                const a = '31250000000000000000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 52 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x98BCE99aa50CB33eca0dDcb2a04404B80dEd3F3E, a: 46875000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x98BCE99aa50CB33eca0dDcb2a04404B80dEd3F3E';
                const a = '46875000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 53 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xeE74a1e81B6C55e3D02D05D7CaE9FD6BCee0E651, a: 13020833333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xeE74a1e81B6C55e3D02D05D7CaE9FD6BCee0E651';
                const a = '13020833333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 54 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xeE74a1e81B6C55e3D02D05D7CaE9FD6BCee0E651, a: 26041666666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xeE74a1e81B6C55e3D02D05D7CaE9FD6BCee0E651';
                const a = '26041666666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 55 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xeE74a1e81B6C55e3D02D05D7CaE9FD6BCee0E651, a: 39062500000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xeE74a1e81B6C55e3D02D05D7CaE9FD6BCee0E651';
                const a = '39062500000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 56 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x9f8eF2849133286860A8216cA11359381706Fa4a, a: 1117021276595750000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x9f8eF2849133286860A8216cA11359381706Fa4a';
                const a = '1117021276595750000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 57 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x9f8eF2849133286860A8216cA11359381706Fa4a, a: 2234042553191500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x9f8eF2849133286860A8216cA11359381706Fa4a';
                const a = '2234042553191500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 58 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x9f8eF2849133286860A8216cA11359381706Fa4a, a: 37500000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x9f8eF2849133286860A8216cA11359381706Fa4a';
                const a = '37500000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 59 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x8D88F01D183DDfD30782E565fdBcD85c14413cAF, a: 11458333333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x8D88F01D183DDfD30782E565fdBcD85c14413cAF';
                const a = '11458333333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 60 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x8D88F01D183DDfD30782E565fdBcD85c14413cAF, a: 22916666666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x8D88F01D183DDfD30782E565fdBcD85c14413cAF';
                const a = '22916666666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 61 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x8D88F01D183DDfD30782E565fdBcD85c14413cAF, a: 34375000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x8D88F01D183DDfD30782E565fdBcD85c14413cAF';
                const a = '34375000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 62 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xB862D5e30DE97368801bDC24A53aD90F56a9C068, a: 11007113064583333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xB862D5e30DE97368801bDC24A53aD90F56a9C068';
                const a = '11007113064583333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 63 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xB862D5e30DE97368801bDC24A53aD90F56a9C068, a: 22014226129166667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xB862D5e30DE97368801bDC24A53aD90F56a9C068';
                const a = '22014226129166667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 64 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xB862D5e30DE97368801bDC24A53aD90F56a9C068, a: 33021339193750000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xB862D5e30DE97368801bDC24A53aD90F56a9C068';
                const a = '33021339193750000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 65 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x4F9ef189F387e0a91d46812cFB2ecE0d558a471C, a: 10520833333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x4F9ef189F387e0a91d46812cFB2ecE0d558a471C';
                const a = '10520833333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 66 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x4F9ef189F387e0a91d46812cFB2ecE0d558a471C, a: 21041666666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x4F9ef189F387e0a91d46812cFB2ecE0d558a471C';
                const a = '21041666666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 67 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x4F9ef189F387e0a91d46812cFB2ecE0d558a471C, a: 31562500000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x4F9ef189F387e0a91d46812cFB2ecE0d558a471C';
                const a = '31562500000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 68 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x79e5c907b9d4Af5840C687e6975a1C530895454a, a: 10439583333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x79e5c907b9d4Af5840C687e6975a1C530895454a';
                const a = '10439583333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 69 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x79e5c907b9d4Af5840C687e6975a1C530895454a, a: 20879166666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x79e5c907b9d4Af5840C687e6975a1C530895454a';
                const a = '20879166666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 70 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x79e5c907b9d4Af5840C687e6975a1C530895454a, a: 31318750000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x79e5c907b9d4Af5840C687e6975a1C530895454a';
                const a = '31318750000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 71 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xFB81414570E338E28C98417c38A3A5c9C6503516, a: 10417708333333333000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xFB81414570E338E28C98417c38A3A5c9C6503516';
                const a = '10417708333333333000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 72 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xFB81414570E338E28C98417c38A3A5c9C6503516, a: 20835416666666667000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xFB81414570E338E28C98417c38A3A5c9C6503516';
                const a = '20835416666666667000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 73 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xFB81414570E338E28C98417c38A3A5c9C6503516, a: 31253125000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xFB81414570E338E28C98417c38A3A5c9C6503516';
                const a = '31253125000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 74 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x35e55F287EFA64dAb88A289a32F9e5942Ab28b18, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x35e55F287EFA64dAb88A289a32F9e5942Ab28b18';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 75 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x35e55F287EFA64dAb88A289a32F9e5942Ab28b18, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x35e55F287EFA64dAb88A289a32F9e5942Ab28b18';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 76 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x35e55F287EFA64dAb88A289a32F9e5942Ab28b18, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x35e55F287EFA64dAb88A289a32F9e5942Ab28b18';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 77 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xda7B5C50874a82C0262b4eA6e6001E2b002829E9, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xda7B5C50874a82C0262b4eA6e6001E2b002829E9';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 78 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xda7B5C50874a82C0262b4eA6e6001E2b002829E9, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xda7B5C50874a82C0262b4eA6e6001E2b002829E9';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 79 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xda7B5C50874a82C0262b4eA6e6001E2b002829E9, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xda7B5C50874a82C0262b4eA6e6001E2b002829E9';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 80 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x7Ed273A361D6bb16833f0E563C313e205738112f, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7Ed273A361D6bb16833f0E563C313e205738112f';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 81 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x7Ed273A361D6bb16833f0E563C313e205738112f, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7Ed273A361D6bb16833f0E563C313e205738112f';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 82 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7Ed273A361D6bb16833f0E563C313e205738112f, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x7Ed273A361D6bb16833f0E563C313e205738112f';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 83 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x3cB704A5FB4428796b728DF7e4CbC67BCA1497Ae, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x3cB704A5FB4428796b728DF7e4CbC67BCA1497Ae';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 84 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x3cB704A5FB4428796b728DF7e4CbC67BCA1497Ae, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x3cB704A5FB4428796b728DF7e4CbC67BCA1497Ae';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 85 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x3cB704A5FB4428796b728DF7e4CbC67BCA1497Ae, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x3cB704A5FB4428796b728DF7e4CbC67BCA1497Ae';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 86 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xEc8c50223E785C3Ff21fd9F9ABafAcfB1e2215FC, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xEc8c50223E785C3Ff21fd9F9ABafAcfB1e2215FC';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 87 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xEc8c50223E785C3Ff21fd9F9ABafAcfB1e2215FC, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xEc8c50223E785C3Ff21fd9F9ABafAcfB1e2215FC';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 88 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xEc8c50223E785C3Ff21fd9F9ABafAcfB1e2215FC, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xEc8c50223E785C3Ff21fd9F9ABafAcfB1e2215FC';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 89 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x871cAEF9d39e05f76A3F6A3Bb7690168f0188925, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x871cAEF9d39e05f76A3F6A3Bb7690168f0188925';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 90 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x871cAEF9d39e05f76A3F6A3Bb7690168f0188925, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x871cAEF9d39e05f76A3F6A3Bb7690168f0188925';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 91 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x871cAEF9d39e05f76A3F6A3Bb7690168f0188925, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x871cAEF9d39e05f76A3F6A3Bb7690168f0188925';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 92 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xbE20DFb456b7E81f691A8445d073e56602E3cefa, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xbE20DFb456b7E81f691A8445d073e56602E3cefa';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 93 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xbE20DFb456b7E81f691A8445d073e56602E3cefa, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xbE20DFb456b7E81f691A8445d073e56602E3cefa';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 94 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xbE20DFb456b7E81f691A8445d073e56602E3cefa, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xbE20DFb456b7E81f691A8445d073e56602E3cefa';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 95 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x710A169B822Bf51b8F8E6538c63deD200932BB29, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x710A169B822Bf51b8F8E6538c63deD200932BB29';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 96 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x710A169B822Bf51b8F8E6538c63deD200932BB29, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x710A169B822Bf51b8F8E6538c63deD200932BB29';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 97 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x710A169B822Bf51b8F8E6538c63deD200932BB29, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x710A169B822Bf51b8F8E6538c63deD200932BB29';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 98 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x6Fa98A4254c7E9Ec681cCeb3Cb8D64a70Dbea256, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x6Fa98A4254c7E9Ec681cCeb3Cb8D64a70Dbea256';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 99 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x6Fa98A4254c7E9Ec681cCeb3Cb8D64a70Dbea256, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x6Fa98A4254c7E9Ec681cCeb3Cb8D64a70Dbea256';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 100 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x6Fa98A4254c7E9Ec681cCeb3Cb8D64a70Dbea256, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x6Fa98A4254c7E9Ec681cCeb3Cb8D64a70Dbea256';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 101 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x524b7c9B4cA33ba72445DFd2d6404C81d8D1F2E3, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x524b7c9B4cA33ba72445DFd2d6404C81d8D1F2E3';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 102 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x524b7c9B4cA33ba72445DFd2d6404C81d8D1F2E3, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x524b7c9B4cA33ba72445DFd2d6404C81d8D1F2E3';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 103 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x524b7c9B4cA33ba72445DFd2d6404C81d8D1F2E3, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x524b7c9B4cA33ba72445DFd2d6404C81d8D1F2E3';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 104 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x92fc7C69AD976e188b004Cd60Cbd0C8448c770bA, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x92fc7C69AD976e188b004Cd60Cbd0C8448c770bA';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 105 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x92fc7C69AD976e188b004Cd60Cbd0C8448c770bA, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x92fc7C69AD976e188b004Cd60Cbd0C8448c770bA';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 106 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x92fc7C69AD976e188b004Cd60Cbd0C8448c770bA, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x92fc7C69AD976e188b004Cd60Cbd0C8448c770bA';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 107 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x32f8E5d3F4039d1DF89B6A1e544288289A500Fd1, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x32f8E5d3F4039d1DF89B6A1e544288289A500Fd1';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 108 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x32f8E5d3F4039d1DF89B6A1e544288289A500Fd1, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x32f8E5d3F4039d1DF89B6A1e544288289A500Fd1';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 109 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x32f8E5d3F4039d1DF89B6A1e544288289A500Fd1, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x32f8E5d3F4039d1DF89B6A1e544288289A500Fd1';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 110 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x256b09f7Ae7d5fec8C8ac77184CA09F867BbBf4c, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x256b09f7Ae7d5fec8C8ac77184CA09F867BbBf4c';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 111 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x256b09f7Ae7d5fec8C8ac77184CA09F867BbBf4c, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x256b09f7Ae7d5fec8C8ac77184CA09F867BbBf4c';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 112 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x256b09f7Ae7d5fec8C8ac77184CA09F867BbBf4c, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x256b09f7Ae7d5fec8C8ac77184CA09F867BbBf4c';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 113 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xC9D15F4E6f1b37CbF0E8068Ff84B5282edEF9707, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xC9D15F4E6f1b37CbF0E8068Ff84B5282edEF9707';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 114 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xC9D15F4E6f1b37CbF0E8068Ff84B5282edEF9707, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xC9D15F4E6f1b37CbF0E8068Ff84B5282edEF9707';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 115 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xC9D15F4E6f1b37CbF0E8068Ff84B5282edEF9707, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xC9D15F4E6f1b37CbF0E8068Ff84B5282edEF9707';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 116 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x8ad686fB89b2944B083C900ec5dDCd2bB02af1D0, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x8ad686fB89b2944B083C900ec5dDCd2bB02af1D0';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 117 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x8ad686fB89b2944B083C900ec5dDCd2bB02af1D0, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x8ad686fB89b2944B083C900ec5dDCd2bB02af1D0';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 118 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x8ad686fB89b2944B083C900ec5dDCd2bB02af1D0, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x8ad686fB89b2944B083C900ec5dDCd2bB02af1D0';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 119 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0xe1C69F432f2Ba9eEb33ab4bDd23BD417cb89886a, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xe1C69F432f2Ba9eEb33ab4bDd23BD417cb89886a';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 120 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0xe1C69F432f2Ba9eEb33ab4bDd23BD417cb89886a, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xe1C69F432f2Ba9eEb33ab4bDd23BD417cb89886a';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 121 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xe1C69F432f2Ba9eEb33ab4bDd23BD417cb89886a, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0xe1C69F432f2Ba9eEb33ab4bDd23BD417cb89886a';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 122 2022-08-28 00:00:00 ====== [333333333333333333] = 0.33333333333333 =========
            it("wallet: 0x355e03d40211cc6b6D18ce52278e91566fF29839, a: 10416666666666667000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x355e03d40211cc6b6D18ce52278e91566fF29839';
                const a = '10416666666666667000000';
                const t = 1661644800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 123 2023-02-24 00:00:00 ====== [666666666666666666] = 0.66666666666667 =========
            it("wallet: 0x355e03d40211cc6b6D18ce52278e91566fF29839, a: 20833333333333333000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x355e03d40211cc6b6D18ce52278e91566fF29839';
                const a = '20833333333333333000000';
                const t = 1677196800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 124 2023-08-23 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x355e03d40211cc6b6D18ce52278e91566fF29839, a: 31250000000000000000000, t: 2023-08-23 00:00:00 (1692748800)", async function() { 
                const wallet = '0x355e03d40211cc6b6D18ce52278e91566fF29839';
                const a = '31250000000000000000000';
                const t = 1692748800;
            const r = 1;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 125 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x4F80d10339CdA1EDc936e15E7066C1DBbd8Eb01F, a: 7891000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x4F80d10339CdA1EDc936e15E7066C1DBbd8Eb01F';
                const a = '7891000000000000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 126 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x4F80d10339CdA1EDc936e15E7066C1DBbd8Eb01F, a: 15782000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x4F80d10339CdA1EDc936e15E7066C1DBbd8Eb01F';
                const a = '15782000000000000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 127 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x4959769500C751f32FEa39012b5244C722c643Dd, a: 5333766019899000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x4959769500C751f32FEa39012b5244C722c643Dd';
                const a = '5333766019899000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 128 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x4959769500C751f32FEa39012b5244C722c643Dd, a: 10667532039798000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x4959769500C751f32FEa39012b5244C722c643Dd';
                const a = '10667532039798000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 129 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x89BFc312583bE9a9E518928F24eBdc03270C7375, a: 5324468085106500000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x89BFc312583bE9a9E518928F24eBdc03270C7375';
                const a = '5324468085106500000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 130 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x89BFc312583bE9a9E518928F24eBdc03270C7375, a: 10648936170213000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x89BFc312583bE9a9E518928F24eBdc03270C7375';
                const a = '10648936170213000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 131 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x4d35B59A3C1F59D5fF94dD7B2b3A1198378c4678, a: 5319799026595500000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x4d35B59A3C1F59D5fF94dD7B2b3A1198378c4678';
                const a = '5319799026595500000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 132 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x4d35B59A3C1F59D5fF94dD7B2b3A1198378c4678, a: 10639598053191000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x4d35B59A3C1F59D5fF94dD7B2b3A1198378c4678';
                const a = '10639598053191000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 133 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xa73eAf66656270Cc2b27304a170a3ACbd666B54B, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xa73eAf66656270Cc2b27304a170a3ACbd666B54B';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 134 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xa73eAf66656270Cc2b27304a170a3ACbd666B54B, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xa73eAf66656270Cc2b27304a170a3ACbd666B54B';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 135 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xb647f84d4DC1C9bD9Bf42BfFe0FEA69C9F2bb843, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xb647f84d4DC1C9bD9Bf42BfFe0FEA69C9F2bb843';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 136 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xb647f84d4DC1C9bD9Bf42BfFe0FEA69C9F2bb843, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xb647f84d4DC1C9bD9Bf42BfFe0FEA69C9F2bb843';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 137 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x33Ad49856da25b8E2E2D762c411AEda0D1727918, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x33Ad49856da25b8E2E2D762c411AEda0D1727918';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 138 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x33Ad49856da25b8E2E2D762c411AEda0D1727918, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x33Ad49856da25b8E2E2D762c411AEda0D1727918';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 139 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x420ACe7D85821A887891A43CC8a2aFE0D84433a9, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x420ACe7D85821A887891A43CC8a2aFE0D84433a9';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 140 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x420ACe7D85821A887891A43CC8a2aFE0D84433a9, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x420ACe7D85821A887891A43CC8a2aFE0D84433a9';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 141 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x3A484fc4E7873Bd79D0B9B05ED6067A549eC9f49, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x3A484fc4E7873Bd79D0B9B05ED6067A549eC9f49';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 142 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x3A484fc4E7873Bd79D0B9B05ED6067A549eC9f49, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x3A484fc4E7873Bd79D0B9B05ED6067A549eC9f49';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 143 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x7AE29F334D7cb67b58df5aE2A19F360F1Fd3bE75, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7AE29F334D7cb67b58df5aE2A19F360F1Fd3bE75';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 144 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7AE29F334D7cb67b58df5aE2A19F360F1Fd3bE75, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7AE29F334D7cb67b58df5aE2A19F360F1Fd3bE75';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 145 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xd09153823Cf2f29ed6B7E959739bca97C1D273B8, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xd09153823Cf2f29ed6B7E959739bca97C1D273B8';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 146 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xd09153823Cf2f29ed6B7E959739bca97C1D273B8, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xd09153823Cf2f29ed6B7E959739bca97C1D273B8';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 147 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xDE92728804683EC03EFAF6C293e428fc72C2ec95, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xDE92728804683EC03EFAF6C293e428fc72C2ec95';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 148 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xDE92728804683EC03EFAF6C293e428fc72C2ec95, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xDE92728804683EC03EFAF6C293e428fc72C2ec95';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 149 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x3A79caC51e770a84E8Cb5155AAafAA9CaC83F429, a: 5319148936170000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x3A79caC51e770a84E8Cb5155AAafAA9CaC83F429';
                const a = '5319148936170000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 150 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x3A79caC51e770a84E8Cb5155AAafAA9CaC83F429, a: 10638297872340000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x3A79caC51e770a84E8Cb5155AAafAA9CaC83F429';
                const a = '10638297872340000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 151 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x5A20ab4F35Dba889D1f6244c0D53A153DCd28766, a: 4722230971276600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x5A20ab4F35Dba889D1f6244c0D53A153DCd28766';
                const a = '4722230971276600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 152 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x5A20ab4F35Dba889D1f6244c0D53A153DCd28766, a: 9444461942553200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x5A20ab4F35Dba889D1f6244c0D53A153DCd28766';
                const a = '9444461942553200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 153 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x79440849d5BA6Df5fb1F45Ff36BE3979F4271fa4, a: 3759074332978700000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x79440849d5BA6Df5fb1F45Ff36BE3979F4271fa4';
                const a = '3759074332978700000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 154 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x79440849d5BA6Df5fb1F45Ff36BE3979F4271fa4, a: 7518148665957400000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x79440849d5BA6Df5fb1F45Ff36BE3979F4271fa4';
                const a = '7518148665957400000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 155 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xbD0Ad704f38AfebbCb4BA891389938D4177A8A92, a: 3723404255319150000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xbD0Ad704f38AfebbCb4BA891389938D4177A8A92';
                const a = '3723404255319150000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 156 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xbD0Ad704f38AfebbCb4BA891389938D4177A8A92, a: 7446808510638300000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xbD0Ad704f38AfebbCb4BA891389938D4177A8A92';
                const a = '7446808510638300000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 157 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x21130c9b9D00BcB6cDAF24d0E85809cf96251F35, a: 3244680851063850000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x21130c9b9D00BcB6cDAF24d0E85809cf96251F35';
                const a = '3244680851063850000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 158 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x21130c9b9D00BcB6cDAF24d0E85809cf96251F35, a: 6489361702127700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x21130c9b9D00BcB6cDAF24d0E85809cf96251F35';
                const a = '6489361702127700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 159 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x42A6396437eBA7bFD6B5195B7134BE64443521ed, a: 3206382978723400000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x42A6396437eBA7bFD6B5195B7134BE64443521ed';
                const a = '3206382978723400000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 160 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x42A6396437eBA7bFD6B5195B7134BE64443521ed, a: 6412765957446800000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x42A6396437eBA7bFD6B5195B7134BE64443521ed';
                const a = '6412765957446800000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 161 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xC3aB2C2Eb604F159C842D9cAdaBBa2d6254c43d5, a: 3194680851063850000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xC3aB2C2Eb604F159C842D9cAdaBBa2d6254c43d5';
                const a = '3194680851063850000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 162 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xC3aB2C2Eb604F159C842D9cAdaBBa2d6254c43d5, a: 6389361702127700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xC3aB2C2Eb604F159C842D9cAdaBBa2d6254c43d5';
                const a = '6389361702127700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 163 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x5D10100d130467cf8DBE2B904100141F1a63318F, a: 3191489361702150000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x5D10100d130467cf8DBE2B904100141F1a63318F';
                const a = '3191489361702150000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 164 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x5D10100d130467cf8DBE2B904100141F1a63318F, a: 6382978723404300000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x5D10100d130467cf8DBE2B904100141F1a63318F';
                const a = '6382978723404300000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 165 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x585a003aA0b446C0F9baD7b3b0BAc5A809988588, a: 3191489361702150000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x585a003aA0b446C0F9baD7b3b0BAc5A809988588';
                const a = '3191489361702150000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 166 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x585a003aA0b446C0F9baD7b3b0BAc5A809988588, a: 6382978723404300000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x585a003aA0b446C0F9baD7b3b0BAc5A809988588';
                const a = '6382978723404300000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 167 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x125EaE40D9898610C926bb5fcEE9529D9ac885aF, a: 3191489361702150000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x125EaE40D9898610C926bb5fcEE9529D9ac885aF';
                const a = '3191489361702150000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 168 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x125EaE40D9898610C926bb5fcEE9529D9ac885aF, a: 6382978723404300000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x125EaE40D9898610C926bb5fcEE9529D9ac885aF';
                const a = '6382978723404300000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 169 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x24f39151D6d8A9574D1DAC49a44F1263999D0dda, a: 2659574468085100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x24f39151D6d8A9574D1DAC49a44F1263999D0dda';
                const a = '2659574468085100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 170 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x24f39151D6d8A9574D1DAC49a44F1263999D0dda, a: 5319148936170200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x24f39151D6d8A9574D1DAC49a44F1263999D0dda';
                const a = '5319148936170200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 171 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xe6BB1bEBF6829ca5240A80F7076E4CFD6Ee540ae, a: 2638297872340450000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xe6BB1bEBF6829ca5240A80F7076E4CFD6Ee540ae';
                const a = '2638297872340450000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 172 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xe6BB1bEBF6829ca5240A80F7076E4CFD6Ee540ae, a: 5276595744680900000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xe6BB1bEBF6829ca5240A80F7076E4CFD6Ee540ae';
                const a = '5276595744680900000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 173 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xf3143D244F33eb40252464d3b692FA519847B7a9, a: 2425531914893600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xf3143D244F33eb40252464d3b692FA519847B7a9';
                const a = '2425531914893600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 174 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xf3143D244F33eb40252464d3b692FA519847B7a9, a: 4851063829787200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xf3143D244F33eb40252464d3b692FA519847B7a9';
                const a = '4851063829787200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 175 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x764108BAcf10e30F6f249d17E7612fB9008923F0, a: 2425531914893600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x764108BAcf10e30F6f249d17E7612fB9008923F0';
                const a = '2425531914893600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 176 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x764108BAcf10e30F6f249d17E7612fB9008923F0, a: 4851063829787200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x764108BAcf10e30F6f249d17E7612fB9008923F0';
                const a = '4851063829787200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 177 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xF6d670C5C0B206f44E93dE811054F8C0b6e15905, a: 2144680851063850000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xF6d670C5C0B206f44E93dE811054F8C0b6e15905';
                const a = '2144680851063850000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 178 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xF6d670C5C0B206f44E93dE811054F8C0b6e15905, a: 4289361702127700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xF6d670C5C0B206f44E93dE811054F8C0b6e15905';
                const a = '4289361702127700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 179 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x73073A915f8a582B061091368486fECA640552BA, a: 2137340425531900000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x73073A915f8a582B061091368486fECA640552BA';
                const a = '2137340425531900000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 180 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x73073A915f8a582B061091368486fECA640552BA, a: 4274680851063800000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x73073A915f8a582B061091368486fECA640552BA';
                const a = '4274680851063800000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 181 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xa66a4b8461e4786C265B7AbD1F5dfdb6e487f809, a: 2128297872340450000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xa66a4b8461e4786C265B7AbD1F5dfdb6e487f809';
                const a = '2128297872340450000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 182 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xa66a4b8461e4786C265B7AbD1F5dfdb6e487f809, a: 4256595744680900000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xa66a4b8461e4786C265B7AbD1F5dfdb6e487f809';
                const a = '4256595744680900000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 183 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x07b449319D200b1189406c58967348c5bA0D4083, a: 2128228728360600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x07b449319D200b1189406c58967348c5bA0D4083';
                const a = '2128228728360600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 184 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x07b449319D200b1189406c58967348c5bA0D4083, a: 4256457456721200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x07b449319D200b1189406c58967348c5bA0D4083';
                const a = '4256457456721200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 185 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x15c5F3a14d4492b1a26f4c6557251a6F247a2Dd5, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x15c5F3a14d4492b1a26f4c6557251a6F247a2Dd5';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 186 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x15c5F3a14d4492b1a26f4c6557251a6F247a2Dd5, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x15c5F3a14d4492b1a26f4c6557251a6F247a2Dd5';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 187 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x7eE33a8939C6e08cfE207519e220456CB770b982, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7eE33a8939C6e08cfE207519e220456CB770b982';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 188 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7eE33a8939C6e08cfE207519e220456CB770b982, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7eE33a8939C6e08cfE207519e220456CB770b982';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 189 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x2aE024C5EE8dA720b9A51F50D53a291aca37dEb1, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x2aE024C5EE8dA720b9A51F50D53a291aca37dEb1';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 190 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x2aE024C5EE8dA720b9A51F50D53a291aca37dEb1, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x2aE024C5EE8dA720b9A51F50D53a291aca37dEb1';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 191 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x0f5A11bEc9B124e73F51186042f4516F924353e0, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x0f5A11bEc9B124e73F51186042f4516F924353e0';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 192 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x0f5A11bEc9B124e73F51186042f4516F924353e0, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x0f5A11bEc9B124e73F51186042f4516F924353e0';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 193 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x2230A3fa220B0234E468a52389272d239CEB809d, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x2230A3fa220B0234E468a52389272d239CEB809d';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 194 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x2230A3fa220B0234E468a52389272d239CEB809d, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x2230A3fa220B0234E468a52389272d239CEB809d';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 195 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x65028EEE0F81E76A8Ffc39721eD4c18643cB9A4C, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x65028EEE0F81E76A8Ffc39721eD4c18643cB9A4C';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 196 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x65028EEE0F81E76A8Ffc39721eD4c18643cB9A4C, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x65028EEE0F81E76A8Ffc39721eD4c18643cB9A4C';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 197 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x931ddC55Ea7074a190ded7429E82dfAdFeDC0269, a: 2127659574468100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x931ddC55Ea7074a190ded7429E82dfAdFeDC0269';
                const a = '2127659574468100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 198 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x931ddC55Ea7074a190ded7429E82dfAdFeDC0269, a: 4255319148936200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x931ddC55Ea7074a190ded7429E82dfAdFeDC0269';
                const a = '4255319148936200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 199 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xB6a95916221Abef28339594161cd154Bc650c515, a: 1882978723404250000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xB6a95916221Abef28339594161cd154Bc650c515';
                const a = '1882978723404250000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 200 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xB6a95916221Abef28339594161cd154Bc650c515, a: 3765957446808500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xB6a95916221Abef28339594161cd154Bc650c515';
                const a = '3765957446808500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 201 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x093E088901909dEecC1b4a1479fBcCE1FBEd31E7, a: 1808510638297850000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x093E088901909dEecC1b4a1479fBcCE1FBEd31E7';
                const a = '1808510638297850000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 202 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x093E088901909dEecC1b4a1479fBcCE1FBEd31E7, a: 3617021276595700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x093E088901909dEecC1b4a1479fBcCE1FBEd31E7';
                const a = '3617021276595700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 203 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xb521154e8f8978f64567FE0FA7359Ab47f7363fA, a: 1643617021276600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xb521154e8f8978f64567FE0FA7359Ab47f7363fA';
                const a = '1643617021276600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 204 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xb521154e8f8978f64567FE0FA7359Ab47f7363fA, a: 3287234042553200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xb521154e8f8978f64567FE0FA7359Ab47f7363fA';
                const a = '3287234042553200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 205 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x9867EBde73BD54d2D7e55E28057A5Fe3bd2027b6, a: 1636393621276600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x9867EBde73BD54d2D7e55E28057A5Fe3bd2027b6';
                const a = '1636393621276600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 206 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x9867EBde73BD54d2D7e55E28057A5Fe3bd2027b6, a: 3272787242553200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x9867EBde73BD54d2D7e55E28057A5Fe3bd2027b6';
                const a = '3272787242553200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 207 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x4D3c3E7F5EBae3aCBac78EfF2457a842Ab86577e, a: 1625531914893600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x4D3c3E7F5EBae3aCBac78EfF2457a842Ab86577e';
                const a = '1625531914893600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 208 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x4D3c3E7F5EBae3aCBac78EfF2457a842Ab86577e, a: 3251063829787200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x4D3c3E7F5EBae3aCBac78EfF2457a842Ab86577e';
                const a = '3251063829787200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 209 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x522b76c8f7764009178B3Fd89bBB0134ADEC44a8, a: 1601322555212750000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x522b76c8f7764009178B3Fd89bBB0134ADEC44a8';
                const a = '1601322555212750000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 210 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x522b76c8f7764009178B3Fd89bBB0134ADEC44a8, a: 3202645110425500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x522b76c8f7764009178B3Fd89bBB0134ADEC44a8';
                const a = '3202645110425500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 211 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x882bBB07991c5c2f65988fd077CdDF405FE5b56f, a: 1596170212765950000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x882bBB07991c5c2f65988fd077CdDF405FE5b56f';
                const a = '1596170212765950000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 212 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x882bBB07991c5c2f65988fd077CdDF405FE5b56f, a: 3192340425531900000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x882bBB07991c5c2f65988fd077CdDF405FE5b56f';
                const a = '3192340425531900000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 213 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x0c2262b636d91Ec5582f4F95b40988a56496B8f1, a: 1595744680851050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x0c2262b636d91Ec5582f4F95b40988a56496B8f1';
                const a = '1595744680851050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 214 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x0c2262b636d91Ec5582f4F95b40988a56496B8f1, a: 3191489361702100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x0c2262b636d91Ec5582f4F95b40988a56496B8f1';
                const a = '3191489361702100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 215 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x57dA448673AfB7a06150Ab7a92c7572e7c75D2E5, a: 1595744680851050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x57dA448673AfB7a06150Ab7a92c7572e7c75D2E5';
                const a = '1595744680851050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 216 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x57dA448673AfB7a06150Ab7a92c7572e7c75D2E5, a: 3191489361702100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x57dA448673AfB7a06150Ab7a92c7572e7c75D2E5';
                const a = '3191489361702100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 217 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x68cf193fFE134aD92C1DB0267d2062D01FEFDD06, a: 1595744680851050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x68cf193fFE134aD92C1DB0267d2062D01FEFDD06';
                const a = '1595744680851050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 218 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x68cf193fFE134aD92C1DB0267d2062D01FEFDD06, a: 3191489361702100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x68cf193fFE134aD92C1DB0267d2062D01FEFDD06';
                const a = '3191489361702100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 219 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x35205135F0883e6a59aF9cb64310c53003433122, a: 1595744680851050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x35205135F0883e6a59aF9cb64310c53003433122';
                const a = '1595744680851050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 220 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x35205135F0883e6a59aF9cb64310c53003433122, a: 3191489361702100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x35205135F0883e6a59aF9cb64310c53003433122';
                const a = '3191489361702100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 221 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xA368bae3df1107cF22Daf0a79761EF94656D789A, a: 1579787234042550000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xA368bae3df1107cF22Daf0a79761EF94656D789A';
                const a = '1579787234042550000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 222 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xA368bae3df1107cF22Daf0a79761EF94656D789A, a: 3159574468085100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xA368bae3df1107cF22Daf0a79761EF94656D789A';
                const a = '3159574468085100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 223 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xA31B0BE89D0bcDF35B39682b652bEb8390A8F2Dc, a: 1456895632978700000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xA31B0BE89D0bcDF35B39682b652bEb8390A8F2Dc';
                const a = '1456895632978700000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 224 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xA31B0BE89D0bcDF35B39682b652bEb8390A8F2Dc, a: 2913791265957400000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xA31B0BE89D0bcDF35B39682b652bEb8390A8F2Dc';
                const a = '2913791265957400000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 225 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x9F74e07D01c8eE7D1b4B0e9739c8c75E8c23Ef4b, a: 1436170212765950000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x9F74e07D01c8eE7D1b4B0e9739c8c75E8c23Ef4b';
                const a = '1436170212765950000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 226 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x9F74e07D01c8eE7D1b4B0e9739c8c75E8c23Ef4b, a: 2872340425531900000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x9F74e07D01c8eE7D1b4B0e9739c8c75E8c23Ef4b';
                const a = '2872340425531900000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 227 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xA7a9544D86066BF583be602195536918497b1fFf, a: 1382978723404250000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xA7a9544D86066BF583be602195536918497b1fFf';
                const a = '1382978723404250000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 228 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xA7a9544D86066BF583be602195536918497b1fFf, a: 2765957446808500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xA7a9544D86066BF583be602195536918497b1fFf';
                const a = '2765957446808500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 229 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x64F8eF34aC5Dc26410f2A1A0e2b4641189040231, a: 1300000000000000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x64F8eF34aC5Dc26410f2A1A0e2b4641189040231';
                const a = '1300000000000000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 230 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x64F8eF34aC5Dc26410f2A1A0e2b4641189040231, a: 2600000000000000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x64F8eF34aC5Dc26410f2A1A0e2b4641189040231';
                const a = '2600000000000000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 231 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xE088efbff6aA52f679F76F33924C61F2D79FF8E2, a: 1276595744680850000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xE088efbff6aA52f679F76F33924C61F2D79FF8E2';
                const a = '1276595744680850000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 232 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xE088efbff6aA52f679F76F33924C61F2D79FF8E2, a: 2553191489361700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xE088efbff6aA52f679F76F33924C61F2D79FF8E2';
                const a = '2553191489361700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 233 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xD0929C7f44AB8cda86502baaf9961527fC856DDC, a: 1257994890494850000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xD0929C7f44AB8cda86502baaf9961527fC856DDC';
                const a = '1257994890494850000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 234 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xD0929C7f44AB8cda86502baaf9961527fC856DDC, a: 2515989780989700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xD0929C7f44AB8cda86502baaf9961527fC856DDC';
                const a = '2515989780989700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 235 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x6592aB22faD2d91c01cCB4429F11022E2595C401, a: 1255913085106400000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x6592aB22faD2d91c01cCB4429F11022E2595C401';
                const a = '1255913085106400000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 236 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x6592aB22faD2d91c01cCB4429F11022E2595C401, a: 2511826170212800000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x6592aB22faD2d91c01cCB4429F11022E2595C401';
                const a = '2511826170212800000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 237 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x07E8cd40Be6DD430a8B70E990D6aF7Cd2c5fD52c, a: 1238343530042550000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x07E8cd40Be6DD430a8B70E990D6aF7Cd2c5fD52c';
                const a = '1238343530042550000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 238 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x07E8cd40Be6DD430a8B70E990D6aF7Cd2c5fD52c, a: 2476687060085100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x07E8cd40Be6DD430a8B70E990D6aF7Cd2c5fD52c';
                const a = '2476687060085100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 239 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x875Bf94C16000710f721Cf453B948f23B7394ec2, a: 1172597069614250000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x875Bf94C16000710f721Cf453B948f23B7394ec2';
                const a = '1172597069614250000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 240 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x875Bf94C16000710f721Cf453B948f23B7394ec2, a: 2345194139228500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x875Bf94C16000710f721Cf453B948f23B7394ec2';
                const a = '2345194139228500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 241 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x1bdaA24527F033ABBe9Bc51b63C0F2a3e913485b, a: 1170212765957450000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x1bdaA24527F033ABBe9Bc51b63C0F2a3e913485b';
                const a = '1170212765957450000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 242 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x1bdaA24527F033ABBe9Bc51b63C0F2a3e913485b, a: 2340425531914900000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x1bdaA24527F033ABBe9Bc51b63C0F2a3e913485b';
                const a = '2340425531914900000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 243 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x687922176D1BbcBcdC295E121BcCaA45A1f40fCd, a: 1170212765957450000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x687922176D1BbcBcdC295E121BcCaA45A1f40fCd';
                const a = '1170212765957450000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 244 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x687922176D1BbcBcdC295E121BcCaA45A1f40fCd, a: 2340425531914900000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x687922176D1BbcBcdC295E121BcCaA45A1f40fCd';
                const a = '2340425531914900000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 245 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x2CE83785eD44961959bf5251e85af897Ba9ddAC7, a: 1159851252127650000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x2CE83785eD44961959bf5251e85af897Ba9ddAC7';
                const a = '1159851252127650000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 246 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x2CE83785eD44961959bf5251e85af897Ba9ddAC7, a: 2319702504255300000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x2CE83785eD44961959bf5251e85af897Ba9ddAC7';
                const a = '2319702504255300000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 247 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xCDCaDF2195c1376f59808028eA21630B361Ba9b8, a: 1155319148936150000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xCDCaDF2195c1376f59808028eA21630B361Ba9b8';
                const a = '1155319148936150000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 248 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xCDCaDF2195c1376f59808028eA21630B361Ba9b8, a: 2310638297872300000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xCDCaDF2195c1376f59808028eA21630B361Ba9b8';
                const a = '2310638297872300000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 249 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x7Ff698e124d1D14E6d836aF4dA0Ae448c8FfFa6F, a: 1151467418085100000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7Ff698e124d1D14E6d836aF4dA0Ae448c8FfFa6F';
                const a = '1151467418085100000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 250 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7Ff698e124d1D14E6d836aF4dA0Ae448c8FfFa6F, a: 2302934836170200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7Ff698e124d1D14E6d836aF4dA0Ae448c8FfFa6F';
                const a = '2302934836170200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 251 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x11f53fdAb3054a5cA63778659263aF0838b642b1, a: 1117021276595750000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x11f53fdAb3054a5cA63778659263aF0838b642b1';
                const a = '1117021276595750000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 252 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x11f53fdAb3054a5cA63778659263aF0838b642b1, a: 2234042553191500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x11f53fdAb3054a5cA63778659263aF0838b642b1';
                const a = '2234042553191500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 253 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x826121D2a47c9D6e71Fd4FED082CECCc8A5381b1, a: 1101063829787250000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x826121D2a47c9D6e71Fd4FED082CECCc8A5381b1';
                const a = '1101063829787250000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 254 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x826121D2a47c9D6e71Fd4FED082CECCc8A5381b1, a: 2202127659574500000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x826121D2a47c9D6e71Fd4FED082CECCc8A5381b1';
                const a = '2202127659574500000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 255 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x674901AdeB413C126a069402E751ba80F2e2152e, a: 1100889222064550000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x674901AdeB413C126a069402E751ba80F2e2152e';
                const a = '1100889222064550000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 256 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x674901AdeB413C126a069402E751ba80F2e2152e, a: 2201778444129100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x674901AdeB413C126a069402E751ba80F2e2152e';
                const a = '2201778444129100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 257 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x228Bb6C83e8d0767eD342dd333DDbD55Ad217a3D, a: 1095744680851050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x228Bb6C83e8d0767eD342dd333DDbD55Ad217a3D';
                const a = '1095744680851050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 258 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x228Bb6C83e8d0767eD342dd333DDbD55Ad217a3D, a: 2191489361702100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x228Bb6C83e8d0767eD342dd333DDbD55Ad217a3D';
                const a = '2191489361702100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 259 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xB248B3309e31Ca924449fd2dbe21862E9f1accf5, a: 1086334925304350000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xB248B3309e31Ca924449fd2dbe21862E9f1accf5';
                const a = '1086334925304350000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 260 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xB248B3309e31Ca924449fd2dbe21862E9f1accf5, a: 2172669850608700000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xB248B3309e31Ca924449fd2dbe21862E9f1accf5';
                const a = '2172669850608700000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 261 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xb14ae50038abBd0F5B38b93F4384e4aFE83b9350, a: 1085106382978700000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xb14ae50038abBd0F5B38b93F4384e4aFE83b9350';
                const a = '1085106382978700000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 262 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xb14ae50038abBd0F5B38b93F4384e4aFE83b9350, a: 2170212765957400000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xb14ae50038abBd0F5B38b93F4384e4aFE83b9350';
                const a = '2170212765957400000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 263 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x795e43E9e2423620dA9107F2a5088e039F9A0112, a: 1083617021276600000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x795e43E9e2423620dA9107F2a5088e039F9A0112';
                const a = '1083617021276600000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 264 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x795e43E9e2423620dA9107F2a5088e039F9A0112, a: 2167234042553200000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x795e43E9e2423620dA9107F2a5088e039F9A0112';
                const a = '2167234042553200000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 265 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x86649d0a9cAf37b51E33b04d89d4BF63dd696fE6, a: 1079787234042550000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x86649d0a9cAf37b51E33b04d89d4BF63dd696fE6';
                const a = '1079787234042550000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 266 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x86649d0a9cAf37b51E33b04d89d4BF63dd696fE6, a: 2159574468085100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x86649d0a9cAf37b51E33b04d89d4BF63dd696fE6';
                const a = '2159574468085100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 267 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x8a382bb6BF2008492268DEdC549B6Cf189a067B5, a: 1071546481914900000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x8a382bb6BF2008492268DEdC549B6Cf189a067B5';
                const a = '1071546481914900000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 268 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x8a382bb6BF2008492268DEdC549B6Cf189a067B5, a: 2143092963829800000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x8a382bb6BF2008492268DEdC549B6Cf189a067B5';
                const a = '2143092963829800000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 269 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x687cEE1e9B4E2a33A63C5319fe6D5DbBaa8d5E91, a: 1071276595744700000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x687cEE1e9B4E2a33A63C5319fe6D5DbBaa8d5E91';
                const a = '1071276595744700000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 270 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x687cEE1e9B4E2a33A63C5319fe6D5DbBaa8d5E91, a: 2142553191489400000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x687cEE1e9B4E2a33A63C5319fe6D5DbBaa8d5E91';
                const a = '2142553191489400000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 271 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x390b07DC402DcFD54D5113C8f85d90329A0141ef, a: 1064893617021300000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x390b07DC402DcFD54D5113C8f85d90329A0141ef';
                const a = '1064893617021300000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 272 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x390b07DC402DcFD54D5113C8f85d90329A0141ef, a: 2129787234042600000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x390b07DC402DcFD54D5113C8f85d90329A0141ef';
                const a = '2129787234042600000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 273 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x0aa05378529F2D1707a0B196B846d7963d677d37, a: 1064893617021300000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x0aa05378529F2D1707a0B196B846d7963d677d37';
                const a = '1064893617021300000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 274 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x0aa05378529F2D1707a0B196B846d7963d677d37, a: 2129787234042600000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x0aa05378529F2D1707a0B196B846d7963d677d37';
                const a = '2129787234042600000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 275 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x8c1203dfC78068b0Fa5d7a2dD2a2fF9cFA89fFcE, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x8c1203dfC78068b0Fa5d7a2dD2a2fF9cFA89fFcE';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 276 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x8c1203dfC78068b0Fa5d7a2dD2a2fF9cFA89fFcE, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x8c1203dfC78068b0Fa5d7a2dD2a2fF9cFA89fFcE';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 277 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xee86f2BAFC7e33EFDD5cf3970e33C361Cb7aDeD9, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xee86f2BAFC7e33EFDD5cf3970e33C361Cb7aDeD9';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 278 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xee86f2BAFC7e33EFDD5cf3970e33C361Cb7aDeD9, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xee86f2BAFC7e33EFDD5cf3970e33C361Cb7aDeD9';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 279 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x0be82Fe1422d6D5cA74fd73A37a6C89636235B25, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x0be82Fe1422d6D5cA74fd73A37a6C89636235B25';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 280 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x0be82Fe1422d6D5cA74fd73A37a6C89636235B25, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x0be82Fe1422d6D5cA74fd73A37a6C89636235B25';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 281 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xF33782f1384a931A3e66650c3741FCC279a838fC, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xF33782f1384a931A3e66650c3741FCC279a838fC';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 282 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xF33782f1384a931A3e66650c3741FCC279a838fC, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xF33782f1384a931A3e66650c3741FCC279a838fC';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 283 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xD878a0a545dCC7751Caf6d796c0267C202A957Db, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xD878a0a545dCC7751Caf6d796c0267C202A957Db';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 284 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xD878a0a545dCC7751Caf6d796c0267C202A957Db, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xD878a0a545dCC7751Caf6d796c0267C202A957Db';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 285 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x7A4Ad79C4EACe6db85a86a9Fa71EEBD9bbA17Af2, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7A4Ad79C4EACe6db85a86a9Fa71EEBD9bbA17Af2';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 286 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7A4Ad79C4EACe6db85a86a9Fa71EEBD9bbA17Af2, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7A4Ad79C4EACe6db85a86a9Fa71EEBD9bbA17Af2';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 287 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x32527CA6ec2B85AbaCA0fb2dd3878e5b7Bb5b370, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x32527CA6ec2B85AbaCA0fb2dd3878e5b7Bb5b370';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 288 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x32527CA6ec2B85AbaCA0fb2dd3878e5b7Bb5b370, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x32527CA6ec2B85AbaCA0fb2dd3878e5b7Bb5b370';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 289 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x35E3c412286d59Af71ba5836cE6017E416ACf8BC, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x35E3c412286d59Af71ba5836cE6017E416ACf8BC';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 290 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x35E3c412286d59Af71ba5836cE6017E416ACf8BC, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x35E3c412286d59Af71ba5836cE6017E416ACf8BC';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 291 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xDc6c3d081691f7ef4ae25f488098aD0350052D43, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xDc6c3d081691f7ef4ae25f488098aD0350052D43';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 292 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xDc6c3d081691f7ef4ae25f488098aD0350052D43, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xDc6c3d081691f7ef4ae25f488098aD0350052D43';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 293 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xfA79F7c2601a4C2A40C80eC10cE0667988B0FC36, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xfA79F7c2601a4C2A40C80eC10cE0667988B0FC36';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 294 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xfA79F7c2601a4C2A40C80eC10cE0667988B0FC36, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xfA79F7c2601a4C2A40C80eC10cE0667988B0FC36';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 295 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xD24596a11337129A939ba11034912B7D55262b46, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xD24596a11337129A939ba11034912B7D55262b46';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 296 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xD24596a11337129A939ba11034912B7D55262b46, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xD24596a11337129A939ba11034912B7D55262b46';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 297 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x5748c8EE8F7Fe23D14096E51Ca0fb3Cb63223643, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x5748c8EE8F7Fe23D14096E51Ca0fb3Cb63223643';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 298 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x5748c8EE8F7Fe23D14096E51Ca0fb3Cb63223643, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x5748c8EE8F7Fe23D14096E51Ca0fb3Cb63223643';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 299 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xe2D18861c892f4eFbaB6b2749e2eDe16aF458A94, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xe2D18861c892f4eFbaB6b2749e2eDe16aF458A94';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 300 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xe2D18861c892f4eFbaB6b2749e2eDe16aF458A94, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xe2D18861c892f4eFbaB6b2749e2eDe16aF458A94';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 301 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x7F052861bf21f5208e7C0e30C9056a79E8314bA9, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x7F052861bf21f5208e7C0e30C9056a79E8314bA9';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 302 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x7F052861bf21f5208e7C0e30C9056a79E8314bA9, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x7F052861bf21f5208e7C0e30C9056a79E8314bA9';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 303 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xA9786dA5d3ABb6C404b79DF28b7f402E58eF7c5B, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xA9786dA5d3ABb6C404b79DF28b7f402E58eF7c5B';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 304 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xA9786dA5d3ABb6C404b79DF28b7f402E58eF7c5B, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xA9786dA5d3ABb6C404b79DF28b7f402E58eF7c5B';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 305 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xaF997affb94c5Ca556b28b024E162AA3164f4A43, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xaF997affb94c5Ca556b28b024E162AA3164f4A43';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 306 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xaF997affb94c5Ca556b28b024E162AA3164f4A43, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xaF997affb94c5Ca556b28b024E162AA3164f4A43';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 307 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x55fb5D5ae4A4F8369209fEf691587d40227166F6, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x55fb5D5ae4A4F8369209fEf691587d40227166F6';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 308 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x55fb5D5ae4A4F8369209fEf691587d40227166F6, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x55fb5D5ae4A4F8369209fEf691587d40227166F6';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 309 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xf98de1A22d715A88C2A33821917e8ce2e5583D5A, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xf98de1A22d715A88C2A33821917e8ce2e5583D5A';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 310 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xf98de1A22d715A88C2A33821917e8ce2e5583D5A, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xf98de1A22d715A88C2A33821917e8ce2e5583D5A';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 311 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x6F15FA9582FdCF84f9F12D32F1C850775fD033eE, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x6F15FA9582FdCF84f9F12D32F1C850775fD033eE';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 312 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x6F15FA9582FdCF84f9F12D32F1C850775fD033eE, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x6F15FA9582FdCF84f9F12D32F1C850775fD033eE';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 313 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x6F255406306D6D78e97a29F7f249f6d2d85d9801, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x6F255406306D6D78e97a29F7f249f6d2d85d9801';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 314 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x6F255406306D6D78e97a29F7f249f6d2d85d9801, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x6F255406306D6D78e97a29F7f249f6d2d85d9801';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 315 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x2fb0d4F09e5F7E399354D8DbF602c871b84c081F, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x2fb0d4F09e5F7E399354D8DbF602c871b84c081F';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 316 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x2fb0d4F09e5F7E399354D8DbF602c871b84c081F, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x2fb0d4F09e5F7E399354D8DbF602c871b84c081F';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 317 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x6B745dEfEE931Ee790DFe5333446eF454c45D8Cf, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x6B745dEfEE931Ee790DFe5333446eF454c45D8Cf';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 318 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x6B745dEfEE931Ee790DFe5333446eF454c45D8Cf, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x6B745dEfEE931Ee790DFe5333446eF454c45D8Cf';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 319 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x94d3B13745c23fB57a9634Db0b6e4f0d8b5a1053, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x94d3B13745c23fB57a9634Db0b6e4f0d8b5a1053';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 320 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x94d3B13745c23fB57a9634Db0b6e4f0d8b5a1053, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x94d3B13745c23fB57a9634Db0b6e4f0d8b5a1053';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 321 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0x498E96c727700a6B7aC2c4EfBd3E9a5DA4F0d137, a: 1063829787234050000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0x498E96c727700a6B7aC2c4EfBd3E9a5DA4F0d137';
                const a = '1063829787234050000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 322 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0x498E96c727700a6B7aC2c4EfBd3E9a5DA4F0d137, a: 2127659574468100000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0x498E96c727700a6B7aC2c4EfBd3E9a5DA4F0d137';
                const a = '2127659574468100000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 323 2022-08-28 00:00:00 ====== [500000000000000000] = 0.5 =========
            it("wallet: 0xB7c3A0928c06A80DC4A4CDc9dC0aec33E047A4c8, a: 531914893617000000000, t: 2022-08-28 00:00:00 (1661644800)", async function() { 
                const wallet = '0xB7c3A0928c06A80DC4A4CDc9dC0aec33E047A4c8';
                const a = '531914893617000000000';
                const t = 1661644800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

            //================= 324 2023-02-24 00:00:00 ====== [1000000000000000000] = 1 =========
            it("wallet: 0xB7c3A0928c06A80DC4A4CDc9dC0aec33E047A4c8, a: 1063829787234000000000, t: 2023-02-24 00:00:00 (1677196800)", async function() { 
                const wallet = '0xB7c3A0928c06A80DC4A4CDc9dC0aec33E047A4c8';
                const a = '1063829787234000000000';
                const t = 1677196800;
            const r = 2;
            let v = await crowdsaleVesting.calculateUnlockedTokens(wallet, r, t);
            v = v.toString();
            v = v.substring(0,14);
                expect(v).to.be.equal(a.substring(0,14));
            });

        });

        it("Should be half of available to claim on the middle of vesting at seed round", async function() {
            await addaoToken.transfer(payer1.address, '625000000000000000000000');
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 0, twelveMonthPass)).toString()).to.be.equal('312500000000000000000000');
        });
        it("Should be half of available to claim on the middle of vesting at private 1 round", async function() {
            await addaoToken.transfer(payer2.address, '31250000000000000000000');
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer2.address, 1, nineMonthPass)).toString()).to.be.equal('15625000000000000000000');
        });
        it("Should be half of available to claim on the middle of vesting at private 2 round", async function() {
            await addaoToken.transfer(payer3.address, '2170212765957400000000');
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer3.address, 2, sixMonthPass)).toString()).to.be.equal('1085106382978700000000');
        });
        it("Should be available to claim amount of tokents at the first second, by formula - (Vested_Amounts - Seconds_Passed) / Period_Vesting", async function() {
            await addaoToken.transfer(payer1.address, '625000000000000000000000');
            const oneSecondPass = timestamp + 1;
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 0, oneSecondPass)).toString()).to.be.equal('10046939300411522');
        });
        it("Should return 0 as timestamp less then startDate", async function() {
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());

            const startDatePluslockupPeriod = +(await crowdsaleVesting.START_DATE());
            
            expect((await crowdsaleVesting.calculateUnlockedTokens(payer1.address, 0, startDatePluslockupPeriod - 1)).toString()).to.be.equal('0');
        });
    })

    describe("adminGetCoin", function() {
        it("Should be Fail as unreach to send Eth", async function() {
            await truffleAssert.reverts(web3.eth.sendTransaction({from: owner.address, to: crowdsaleVesting.address, value: web3.utils.toWei('100', "ether")}), "Transaction reverted: function selector was not recognized and there's no fallback nor receive function");
        });
        it("Should be Fail as unreach to call transfer", async function() {
            await truffleAssert.reverts(crowdsaleVesting.adminGetCoin(ethers.utils.parseEther('100').toString()), "Transaction reverted: function call failed to execute");
        });
        it("Should be Fail if caller is not owner", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer1).adminGetCoin(ethers.utils.parseEther('100').toString()), "Transaction reverted without a reason string");
        });
    });

    describe("__increaseTime__",  function() {
        it("Increase time for 6 months", async function() {
            const currentTimestamp = (await web3.eth.getBlock('latest')).timestamp;
            await increaseTime({ ethers }, ethers.BigNumber.from(oneMonth).mul(6)); // Move {{n}} months
            expect((await web3.eth.getBlock('latest')).timestamp).to.be.equal(currentTimestamp + ethers.BigNumber.from(oneMonth).mul(6).toNumber());
        });
    });

    describe("claim", function() {
        it("Should be able to claim", async function() {
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());

            const balanceDdaoTokenBefore = (await ddaoToken.balanceOf(payer1.address)).toString();
            await crowdsaleVesting.connect(payer1).claim(0);
            const balanceDdaoTokenAfter = (await ddaoToken.balanceOf(payer1.address)).toString();
            
            expect(Number(balanceDdaoTokenAfter)).to.be.greaterThan(Number(balanceDdaoTokenBefore));
        });
        it("Should be Fail if address is not included in whitelist", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer4).claim(0), "CrowdsaleVesting: This wallet address is not in whitelist");
        });
        it("Shoutd be Fail if address doesn't participate in round Seed", async function() {
            await addaoToken.connect(owner).approve(payer2.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer2).transferFrom(owner.address, payer2.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer2).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());
            
            await truffleAssert.passes(crowdsaleVesting.connect(payer2).claim(1), '');
            await truffleAssert.reverts(crowdsaleVesting.connect(payer2).claim(0), "CrowdsaleVesting: Nothing to claim");
        })
        it("Shoutd be Fail if address doesn't participate in round Private 1", async function() {
            await addaoToken.connect(owner).approve(payer3.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer3).transferFrom(owner.address, payer3.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer3).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());
            
            await truffleAssert.passes(crowdsaleVesting.connect(payer3).claim(2), '');
            await truffleAssert.reverts(crowdsaleVesting.connect(payer3).claim(1), "CrowdsaleVesting: Nothing to claim");
        })
        it("Shoutd be Fail if address doesn't participate in round Private 2", async function() {
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());
            
            await truffleAssert.passes(crowdsaleVesting.connect(payer1).claim(0), '');
            await truffleAssert.reverts(crowdsaleVesting.connect(payer1).claim(2), "CrowdsaleVesting: Nothing to claim");
        })
    });

    describe("adminGetToken", function() {
        it("Should get any ERC20 tokens from contract to owner wallet if they are on the contract", async function() {            
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());

            await crowdsaleVesting.connect(payer1).claim(0);
            
            const balanceAddaoBefore = await addaoToken.balanceOf(owner.address);

            await crowdsaleVesting.adminGetToken(addaoToken.address, ethers.utils.parseEther('100').toString());
            const balanceAddaoAffter = await addaoToken.balanceOf(owner.address);
            
            expect(ethers.BigNumber.from(balanceAddaoAffter).sub(balanceAddaoBefore).toString()).to.be.equal(ethers.utils.parseEther('100').toString());
        });
        it("Should be Fail if caller is not owner", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer1).adminGetToken(addaoToken.address, ethers.utils.parseEther('100').toString()), "Transaction reverted without a reason string");
        });
    });

    describe("balanceOf", function() {
        it("Should return balance by rounds", async function() {   
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());
            
            await crowdsaleVesting.connect(payer1).claim(0);
            const vestedAmounts = (await crowdsaleVesting.seed(payer1.address)).toString();
            const tokensClaimed = await crowdsaleVesting.tokensClaimed(0, payer1.address);

            const b = (await crowdsaleVesting.balanceOf(payer1.address)).toString();
            const r = ethers.BigNumber.from(vestedAmounts).sub(tokensClaimed).toString();
            expect(b).to.be.equal(r);
        });
    });

    describe("lockAddress", function() { // lockAddress -->> blacklistedAddress
        it("Should be locked and could not claim", async function() {    
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());
            
            await crowdsaleVesting.lockAddress(payer1.address);            
            assert.equal(true, await crowdsaleVesting.blacklist(payer1.address)); 
     
            await truffleAssert.reverts(crowdsaleVesting.connect(payer1).claim(0), "CrowdsaleVesting: This wallet address has been blocked");
        });
        it("Should be Fail if caller is not owner", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer1).lockAddress(owner.address), "Transaction reverted without a reason string");
        });
    });

    describe("unlockAddress", function() {
        it("Should be unlocked", async function() {    
            await addaoToken.connect(owner).approve(payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).transferFrom(owner.address, payer1.address, ethers.utils.parseEther('120000').toString());
            await addaoToken.connect(payer1).approve(crowdsaleVesting.address, ethers.utils.parseEther('120000').toString());

            await crowdsaleVesting.lockAddress(payer1.address);            
            assert.equal(true, await crowdsaleVesting.blacklist(payer1.address));

            await crowdsaleVesting.unlockAddress(payer1.address);            
            assert.equal(false, await crowdsaleVesting.blacklist(payer1.address));
        });
        it("Should be Fail if caller is not owner", async function() {
            await truffleAssert.reverts(crowdsaleVesting.connect(payer1).unlockAddress(owner.address), "Transaction reverted without a reason string");
        });
    });
});