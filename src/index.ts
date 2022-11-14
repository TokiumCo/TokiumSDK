import tokiumAPI from './api';

class Tokium {
    verified: boolean;
    tokenOwner: boolean;
    tokensOwned: number;
    royaltiesPaid?: boolean;
    constructor(verified: boolean, tokenOwner: boolean, tokensOwned: number, royaltiesPaid?: boolean){
        this.verified = verified;
        this.tokenOwner = tokenOwner;
        this.tokensOwned = tokensOwned
        this.royaltiesPaid = royaltiesPaid;
    }

    async getCollectionRoyalties(collectionURL: string) {
        const collectionRoyalties = await tokiumAPI({
            method: 'post',
            url: '/getCollectionRoyalties',
            data: {
                collectionURL
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err)
        });
        return collectionRoyalties
    }

    async getWalletTokens(collectionURL: string, wallet: string) {
        const getTokens = await tokiumAPI({
            method: 'post',
            url: '/getTokensInWallet',
            data: {
                collectionURL,
                wallet
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err)
        });
        return getTokens
    }

    async getTokenHistory(collectionURL: string, wallet: string, walletTokens: string) {
        const getHistory = await tokiumAPI({
            method: 'post',
            url: '/getTokenTransactionHistory',
            data: {
                collectionURL,
                wallet,
                walletTokens
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err)
        });
        return getHistory
    }

    async hasPaidRoyalties(collectionURL: string, wallet: string) {
        const { royaltiesPaid, tokensOwned } = await tokiumAPI({
            method: 'post',
            url: '/hasPaidRoyalties',
            data: {
                collectionLink: collectionURL,
                address: wallet,
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err)
        });
        return { royaltiesPaid, tokensOwned }
    }

    async verifyTokenWithRoyalty(collectionURL: string, wallet: string) {
        const { royaltiesPaid, tokensOwned } = await this.hasPaidRoyalties(collectionURL, wallet);
       
        tokensOwned > 0 ? this.tokenOwner === true : this.tokenOwner === false;
        royaltiesPaid ? this.royaltiesPaid === true : this.royaltiesPaid === false;

        this.tokensOwned = tokensOwned;

        if (tokensOwned && royaltiesPaid) {
            this.verified === true;
        } else {
            this.verified === false;
        }
        return this.verified;
    }

    async verifyToken(collectionURL: string, wallet: string) {
        const tokens = await this.getWalletTokens(collectionURL, wallet);
        if (tokens) {
            this.tokenOwner === true
            this.verified === true
        } else {
            this.tokenOwner === false
            this.verified === false
        }
        return this.verified;
    }
}

export default Tokium