import { AxiosError } from 'axios';
import { Tokium } from '../src/index';

describe('Testing index file return types', () => {
    const collectionLink = "https://magiceden.io/marketplace/cryptotitans";
    const address = "jMrEQWGaF5Z6Hu6iUfBovP6KBZUMi5A66oLqJ9KnQKb";
    const tokenMintAddress = "2Evu4Sw62o1dn2rX1GVaysqM7S5SbjHuw1kxDCrPjB1m";

    const tokium = new Tokium(collectionLink, address);

    test('getRoyalties endpoint', async () => {
        const royalties = await tokium.getCollectionRoyalties();
        // Validate return type
        expect(typeof(royalties) == 'object');
        expect(typeof(royalties.royaltiesPercent) == 'number');
    })

    test('hasNFT endpoint', async () => {
        const NFT = await tokium.hasNFT();
        // Validate return type
        expect(typeof(NFT) == 'object');
        // Validate returned NFTs belong to address
        expect(NFT[0].owner == address);
    })

    test('previousNFTTransfer endpoint', async () => {
        const previousNFTTransfers = await tokium.previousNftTransfers(tokenMintAddress);
        // Validate return type
        expect(typeof(previousNFTTransfers) == 'object');
        // Validate success
        expect(previousNFTTransfers.success == true);
    })

    test('lastTransfer endpoint', async () => {
        const lastTransfer = await tokium.previousNftTransfers(tokenMintAddress);
        // Validate return type
        expect(typeof(lastTransfer) == 'object');
        // Validate success
        expect(lastTransfer.success == true);
    })

    test('hasPaidRoyalties endpoint', async() => {
        const hasPaidRoyalties = await tokium.hasPaidRoyalties();
        // Validate return type
        expect(typeof(hasPaidRoyalties) == 'object');
        expect(typeof(hasPaidRoyalties.royaltiesPaid) == 'boolean');
        expect(typeof(hasPaidRoyalties.tokensOwned) == 'number');
    })

    test('verifyTokenWithRoyalty function', async() => {
        const verified = await tokium.verifyTokenWithRoyalty();
        // Validate return type
        expect(typeof(verified) == 'boolean');

    })

    test('verifyToken function', async() => {
        const verified = await tokium.verifyToken();
        // Validate return type
        expect(typeof(verified) == 'boolean');
    })
})

describe('Testing index file NFT owned', () => {
    const collectionLink = "https://magiceden.io/marketplace/cryptotitans";
    const address = "jMrEQWGaF5Z6Hu6iUfBovP6KBZUMi5A66oLqJ9KnQKb";

    const tokium = new Tokium(collectionLink, address);

    test('getRoyalties endpoint', async () => {
        const royalties = await tokium.getCollectionRoyalties();
        expect(royalties.royaltiesPercent == 7);
    })

    test('hasNFT endpoint', async () => {
        const NFT = await tokium.hasNFT();
        // Validate return type
        expect(typeof(NFT) == 'object');
        // Validate returned NFTs belong to address
        expect(NFT[0].owner == address);
    })

    test('hasPaidRoyalties endpoint', async() => {
        const hasPaidRoyalties = await tokium.hasPaidRoyalties();
        // Validate return object
        expect(hasPaidRoyalties.royaltiesPaid === true);
        expect(hasPaidRoyalties.tokensOwned > 0);
    })

    test('verifyTokenWithRoyalty function', async() => {
        const verified = await tokium.verifyTokenWithRoyalty();
        expect(verified === true);
    })

    test('verifyToken function', async() => {
        const verified = await tokium.verifyToken();
        expect(verified === true);
    })
})

describe('Testing index file no NFT owned', () => {
    const collectionLink = "https://magiceden.io/marketplace/cryptotitans";
    const address = "jMrEQWGaF5Z6Hu6iUfBovP6KBZUMi5A66oLqJ9KnQds";

    const tokium = new Tokium(collectionLink, address);

    test('hasNFT endpoint', async () => {
        const NFT = await tokium.hasNFT();
        // Validate no NFTs owned
        expect(NFT.length == 0);
    })

    test('hasPaidRoyalties endpoint', async() => {
        const hasPaidRoyalties = await tokium.hasPaidRoyalties();
        // Validate return object
        expect(hasPaidRoyalties.royaltiesPaid === false);
        expect(hasPaidRoyalties.tokensOwned = 0);
    })

    test('verifyTokenWithRoyalty function', async() => {
        const verified = await tokium.verifyTokenWithRoyalty();
        expect(verified === false);
    })

    test('verifyToken function', async() => {
        const verified = await tokium.verifyToken();
        expect(verified === false);
    })
})