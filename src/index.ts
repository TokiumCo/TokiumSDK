const Axios = require('axios');

const tokiumAPI = Axios.create({
    baseURL: 'https://api.tokium.co/'
});

const heliusAPI = Axios.create({
    baseURL: "https://api.helius.xyz"
})

class Tokium {
    verified: boolean | undefined;
    collectionURL: string;
    walletAddress: string;
    HeliusApiKey: string;
    constructor(collectionURL: string, walletAddress: string, HeliusApiKey?: string){
        this.collectionURL = collectionURL;
        this.walletAddress = walletAddress;
        this.HeliusApiKey = HeliusApiKey;
    }

    // Get the royalties of a collection
    async getCollectionRoyalties() {
        const collectionRoyalties = await tokiumAPI({
            method: 'POST',
            url: '/getRoyalties',
            data:{
                collectionLink: this.collectionURL,
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return collectionRoyalties
    }

    // Checks whether a wallet has NFT from a collection and returns data object
    async hasNFT() {
        const hasNFT = await tokiumAPI({
            method: 'POST',
            url: '/hasNFT',
            data:{
                collectionLink: this.collectionURL,
                address: this.walletAddress,
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return hasNFT
    }

    // Gets data from previous NFT transfers
    async previousNftTransfers(mintAddress: string) {
        if (!mintAddress) {
            throw new Error('Token mint address is required to call the previousNftTransfer endpoint!')
        }
        const previousNftTransfers = await tokiumAPI({
            method: 'POST',
            url: '/previousNftTransfers',
            data:{ tokenMintAddress: mintAddress},
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return previousNftTransfers
    }

    // Gets the data from the last transfer
    async lastTransfer(mintAddress: string) {
        if (!mintAddress) {
            throw new Error('Token mint address is required to call the lastTransfer endpoint!')
        }
        const lastTransfer = await tokiumAPI({
            method: 'POST',
            url: '/lastTransfer',
            data:{ tokenMintAddress: mintAddress},
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return lastTransfer
    }

    // Returns royalties paid and tokens owned 
    async hasPaidRoyalties() {
        const verified = await tokiumAPI({
            method: 'POST',
            url: '/hasPaidRoyalties',
            data: {
                    collectionLink: this.collectionURL,
                    address: this.walletAddress,
                }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return verified
    }

    // Magic Eden collection address M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K
    async getListings(collectionName: string, marketplaceAddress: string) {
        const listings = await heliusAPI({
            method: 'GET',
            url: `/v0/addresses/${marketplaceAddress}/nft-events?api-key=${this.HeliusApiKey}&type=NFT_LISTING`
        }).then((res) => {
            const collectionListings = res.data.filter(nft => nft.description.includes(collectionName) === true);
            if (collectionListings.length == 0) return "No listings found at this time";
            return collectionListings;
        }).catch((err) => {
            throw new Error(err);
        });
        return listings;
    }

    async getListedMagicEdenURL(collectionName: string, address: string) {
        const listings = await this.getListings(collectionName, address);
        const listedMEUrls = [];
        for (const listing of listings) {
            const mintAddress = listing.nfts[0]['mint'];
            const nftIdRegex = /\#[0-9]{1,4}/;
            const id = nftIdRegex.exec(listing.description)[0].replace('#', '');
            const listedMEUrl = new URL(`https://magiceden.io/item-details/${mintAddress}?name=${collectionName}-$23${id}`);    
            listedMEUrls.push(listedMEUrl)
        }
        return listedMEUrls;
    }

    async getMetadata(mintAddresses: object) {
        const metadata = await heliusAPI({
            method: 'POST',
            url: `/v0/tokens/metadata?api-key=${this.HeliusApiKey}`,
            data: {
                mintAccounts: mintAddresses
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err);
        })
        return metadata;
    }
}

module.exports({ Tokium });
