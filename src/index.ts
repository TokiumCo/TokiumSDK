import Axios from 'axios';

const tokiumAPI = Axios.create({
    baseURL: 'https://api.tokium.co/'
});

class Tokium {
    verified: boolean | undefined;
    collectionLink: string;
    walletAddress: string | undefined;
    constructor(collectionLink: string, walletAddress: string | undefined){
        this.collectionLink = collectionLink;
        this.walletAddress = walletAddress;
    }

    // Get the royalties of a collection
    async getCollectionRoyalties() {
        const collectionRoyalties = await tokiumAPI({
            method: 'POST',
            url: '/getRoyalties',
            data:{
                collectionLink: this.collectionLink,
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return collectionRoyalties
    }

    // Checks whether a wallet has NFT from a collection and returns data object
    async getOwnedCollectionNFTs() {
        if (this.walletAddress) {
            const verified = await tokiumAPI({
                method: 'POST',
                url: '/ownedCollectionNFTs',
                data: {
                    address: this.walletAddress,
                    collectionLink: this.collectionLink
                }
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                throw new Error(err)
            });
            return verified    
        } else {
            console.log('Provide Wallet Address!');
        }
    }

    // Gets data from previous NFT transfers
    async previousNftTransfers(mintAddress: string) {
        if (mintAddress) {
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
        } else {
            console.log('Provide mint address!');
        }
    }

    // Gets the data from the last transfer
    async lastTransfer(mintAddress: string) {
        if (mintAddress) {
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
        } else {
            console.log('Provide Mint Address!')
        }
    }

    // Verifies if a wallet has paid royalties on one or more NFTs
    async hasPaidRoyalties() {
        if (this.walletAddress) {
            const verified = await tokiumAPI({
                method: 'POST',
                url: '/hasPaidRoyalties',
                data: {
                        collectionLink: this.collectionLink,
                        address: this.walletAddress,
                    }
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                throw new Error(err)
            });
            return verified
        } else {
            console.log('Provide Wallet Address!');
        }
    }

  // Verifies if wallet has paid royalties on all nfts
  async hasPaidAllRoyalties() {
    if (this.walletAddress) { 
        const verified = await tokiumAPI({
            method: 'POST',
            url: '/hasPaidAllRoyalties',
            data: {
                address: this.walletAddress,
                collectionLink: this.collectionLink
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
        return verified
    } else {
        console.log('Provide Wallet Address!');
    }
}

    
    // Get royalties details on all NFTs
    async getRoyaltyDetails() {
        if (this.walletAddress) { 
        const details = await tokiumAPI({
            method: 'POST',
            url: '/royaltyDetails',
            data: {
                address: this.walletAddress,
                collectionLink: this.collectionLink
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            throw new Error(err)
        });
            return details
        } else {
            console.log('Provide Wallet Address!');
        }
    }
    
    // Get the royalty status on a token address
    async getRoyaltyOnMintAddress(mintAddress: string) {
        if (mintAddress) {
            const verified = await tokiumAPI({
                method: 'POST',
                url: '/royaltyOnMintAddress',
                data: {
                    tokenMintAddress: mintAddress
                }
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                throw new Error(err)
            });
            return verified    
        } else {
            console.log('Provide mint address!');
        }
    }
}

export { Tokium };
