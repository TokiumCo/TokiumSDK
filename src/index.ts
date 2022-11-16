import tokiumAPI from './api';

class Tokium {
    verified: boolean | undefined;
    collectionURL: string;
    walletAddress: string;
    constructor(collectionURL: string, walletAddress: string){
        this.collectionURL = collectionURL;
        this.walletAddress = walletAddress;
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
            console.log(err)
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
            console.log(err)
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
            console.log(err)
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
            console.log(err)
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
            console.log(err)
        });
        return verified
    }

    // Returns boolean for if validated
    async verifyTokenWithRoyalty() {
        const { royaltiesPaid, tokensOwned} = await this.hasPaidRoyalties();
        if (royaltiesPaid === true && tokensOwned > 0) {
            this.verified = true;
        } else {
            this.verified = false;
        }
        return this.verified;
    }
}

export { Tokium };
