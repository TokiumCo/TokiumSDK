# TokiumSDK

## Documentation: https://app.gitbook.com/o/pWoySu95v3jwWIHfPlhd/s/dnU905UnC9QbllSb5vD9/sdk-documentation

## SDK Structure

The Tokium SDK implements the Tokium class with collectionURL and walletAddress as constructors in addition to verified as a class variable. Functions that invoke the API are class functions. 

Only Magic Eden collection URLs are supported at the moment.

For example usage see https://app.gitbook.com/o/pWoySu95v3jwWIHfPlhd/s/dnU905UnC9QbllSb5vD9/wrapper-documentation

## Initialization

```
import { Tokium } from "@tokium.co/tokiumsdk";

const tokium = new Tokium(collectionURL, walletAddress);
```

## Class Functions
Some class functions do not require parameters as they use the class constructor variables.

### getCollectionRoyalties()

Retrieves the royalties of the collection URL provided. 

Returns an object `royaltiesPercent: 3.33`, with the type of value being a number.

```
const royalties = await tokium.getCollectionRoyalties()
```

### hasNFT()

Returns an object containing information corresponding to the provided `walletAddress` and `collectionURL`. The object is an array with each entry corresponding to an NFT in the collection owned by the wallet.

```
const NFTs = await tokium.hasNFT();
```

### previousNFTTransfers(tokenMintAddress)

Returns an object containing information about the previous NFT transfers. Requires tokenMintAddress as a parameter.

```
const previousNFTTransfers = await tokium.previousNftTransfers(tokenMintAddress);
```

### lastTransfer(tokenMintAddress)

Returns an object containing information about the last transfer of the NFT. Requires `tokenMintAddress` as a parameter.

```
const lastTransfer = await tokium.lastTransfer(tokenMintAddress);
```

### hasPaidRoyalties()

Returns a `boolean | undefined` for whether the wallet has paid royalties on one or more NFTs in the collection.

```
const verified = await tokium.hasPaidRoyalties();
```
