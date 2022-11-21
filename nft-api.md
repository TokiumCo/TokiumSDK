---
description: >-
  The NFT API contains several endpoints that return information on token
  ownership, past transfers, and royalty payments.
---

# NFT API

### BaseURL

[https://api.tokium.co](https://api.tokium.co)

### DataTypes

The data needed by post requests implemented by the API. Most API methods are POST methods.

#### Data1

Data 1 refers to a JSON object with following fields:

* collectionLink: MagicEden Collection Address
* address: Solana wallet address of the user

```
{
    "collectionLink": "https://magiceden.io/marketplace/cryptotitans",
    "address": "jMrEQWGaF5Z6Hu6iUfBovP6KBZUMi5A66oLqJ9KnQKb"
}
```

#### Data2

Data 2 refers to a JSON object with following fields:

* collectionLink: MagicEden Collection Address

```
{
    "collectionLink": "https://magiceden.io/marketplace/cryptotitans",
}
```

#### Data3

Data 3 refers to a JSON object with following fields:

* tokenMintAddress: Token mint address for the NFT, could be found in NFT metadata

```
{
    "tokenMintAddress": "2Evu4Sw62o1dn2rX1GVaysqM7S5SbjHuw1kxDCrPjB1m",
}
```

### Functions

#### /hasNFT (POST)

Returns metadata of all NFTs owned by a certain wallet from the given collection

* Checks all related NFTs from a batch of first 100
* If at least 1 NFT found, returns it, otherwise, checks the next 100 NFTs in wallet
* repeats

```
let ownedNFTs = await axios.post('BaseURL/hasNFT', Data1).then(res => res.data);
```

#### /getRoyalties (POST)

Returns the royalties in percent from a given collection

```
let ownedNFTs = await axios.post('BaseURL/getRoyalties', Data2).then(res => res.data);
```

#### /hasPaidRoyalties (POST)

The logic works like this: you can make direct transfers to any wallet you like, but as long as the original wallet you sent from had some sort of royalty payment at purchase, you pass. If it's an indirect transfer, then we must check for if the NFT was minted during this transfer, if it was then you pass, otherwise we don't allow indirect transfers (usually for 3rd party in-direct transfers to avoid royalties).

If the user has at least 1 NFT from a given set that they paid royalties for, returns true.

Returns a JSON object containing:

* if user paid roaylties
* number of NFT tokens the user owns
  * Internally uses hasNFT function so also just checks a batch of 100 at a time.

```
let paidRoyalties = await axios.post('BaseURL/hasPaidRoyalties', Data1).then(res => res.data);
```

#### /previousNftTransfers (POST)

Returns the previous 10 transfers for the NFT. Ususally mint is returned as a transfer, but if no transfer is returned, it also means the NFT was minted and never moved ever since.

```
let previous10Transfers = await axios.post('BaseURL/previousNftTransfers', Data3).then(res => res.data);
```

#### /lastTransfer (POST)

Important to note this functions filters direct transfers between a user's wallets. This logic follows from '/hasPaidRoyalties' function. Returns a JSON of the following data:

* transfer: the details on the last transfer. Possibly null for a mint transfer
* transactionDetails: the details on the transaction that occured with last transfer. Possibly null for a mint transaction

```
let lastTransfer = await axios.post('BaseURL/lastTransfer', Data3).then(res => res.data);
```
