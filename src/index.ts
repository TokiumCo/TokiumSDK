const Axios = require('axios');
const { Connection, PublicKey, SystemProgram, VersionedTransaction, TransactionMessage, LAMPORTS_PER_SOL, TransactionInstruction } = require('@solana/web3.js');
const { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } = require('@solana/spl-token');
const buffer = require("buffer");


const tokiumAPI = Axios.create({
  baseURL: 'https://api.tokium.co',
  
});

const heliusAPI = Axios.create({
    baseURL: "https://api.helius.xyz"
})

type NFTProps = {
    collection: string,
    creators: object[],
    image: string,
    mintAddress: string,
    tokenAddress: string,
    name: string,
    owner: string,
    sellerFeeBasisPoints: string,
}

type CreatorType = {
    address: string,
    share: number
}

class Tokium {
    verified: boolean | undefined;
    collectionLink: string;
    walletAddress: string;
    constructor(collectionLink: string, walletAddress: string | undefined){
        this.collectionLink = collectionLink;
        this.walletAddress = walletAddress;
    }
    
    
    // Magic Eden collection address M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K
    async getListings(collectionName: string, marketplaceAddress: string, HeliusApiKey: string) {
        const listings = await heliusAPI({
            method: 'GET',
            url: `/v0/addresses/${marketplaceAddress}/nft-events?api-key=${HeliusApiKey}&type=NFT_LISTING`
        }).then((res) => {
            const collectionListings = res.data.filter(nft => nft.description.includes(collectionName) === true);
            if (collectionListings.length == 0) return "No listings found at this time";
            return collectionListings;
        }).catch((err) => {
            throw new Error(err);
        });
        return listings;
    }

    async getListedMagicEdenURL(collectionName: string, address: string, HeliusAPIKey: string) {
        const listings = await this.getListings(collectionName, address, HeliusAPIKey);
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

    async getMetadata(mintAddresses: object, HeliusApiKey: string) {
        const metadata = await heliusAPI({
            method: 'POST',
            url: `/v0/tokens/metadata?api-key=${HeliusApiKey}`,
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

    paySolanaRoyalties = async (connection: typeof Connection, provider: any, nftObject: NFTProps, owingRoyalties: number | null) => {
        window['Buffer'] = buffer.Buffer;
        if (!provider) return;
        if (!owingRoyalties) return;
    
        const creatorObject = nftObject.creators;
        const Blockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
    
        const sourceAccount = new PublicKey(provider.publicKey);
        const tokenMintAccount = new PublicKey(nftObject.mintAddress);
        const tokenAccount = await getAssociatedTokenAddress(tokenMintAccount, sourceAccount);
    
        const tokenAccountStatus = await getAccount(connection, tokenAccount);
        const mintAccountStatus = await getMint(connection, tokenMintAccount);
    
        const mintDecimals = mintAccountStatus.decimals;
    
        const tokenAmount = BigInt(1);
        if (tokenAmount > tokenAccountStatus.amount) throw new Error('Insufficient Tokens');
    
        const instructions: typeof TransactionInstruction[] = [];
    
        for (const creator of creatorObject) {
            const creatorPublicKey = new PublicKey((creator as CreatorType).address);
            const creatorSharePercentage = ((creator as CreatorType).share)/100;
            const creatorRoyalty = owingRoyalties * creatorSharePercentage;
            instructions.push(
                SystemProgram.transfer({
                  fromPubkey: sourceAccount,
                  toPubkey: creatorPublicKey,
                  lamports: LAMPORTS_PER_SOL * creatorRoyalty,
                })
            );
        }
    
        const transferInstruction = createTransferCheckedInstruction(
            tokenAccount,
            tokenMintAccount,
            tokenAccount,
            sourceAccount,
            tokenAmount,
            mintDecimals
        )
    
        instructions.push(transferInstruction);
    
        const V0Message = new TransactionMessage({
            payerKey: sourceAccount,
            recentBlockhash: Blockhash,
            instructions: instructions
        }).compileToV0Message([]);
    
        const royalties_transaction = new VersionedTransaction(V0Message);
    
        const { signature } = await provider.signAndSendTransaction(royalties_transaction, {maxRetries: 5});
        const status = await connection.getSignatureStatus(signature);
    
        return status;
    }

    // Get the royalties of a collection
    async getCollectionRoyalties() {
        const collectionRoyalties = await tokiumAPI({
            method: 'POST',
            url: '/getRoyalties',
            headers: {
              'Content-Type': 'application/json',
            },
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
                headers: {
                  'Content-Type': 'application/json',
                },
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
                headers: {
                  'Content-Type': 'application/json',
                },
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
                headers: {
                  'Content-Type': 'application/json',
                },
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
                headers: {
                  'Content-Type': 'application/json',
                },
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
            headers: {
              'Content-Type': 'application/json',
            },
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
            headers: {
              'Content-Type': 'application/json',
            },
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
                headers: {
                  'Content-Type': 'application/json',
                },
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

export default Tokium;
