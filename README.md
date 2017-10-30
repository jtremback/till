# Till 
### Cryptocoin Wallet Server

Till is a cryptocoin wallet server that is easy to set up and administer with an emphasis on security best practices. It is designed for App developers who would like to allow their applications to handle cryptocurrency, but do not want to spend several weeks setting up a theft-resistant wallet server. It is built from the ground up to support multiple cryptocurrencies. Our goal is to support all cryptocurrencies eventually, as they are released (although this may not always be possible).

Till is a completely self-contained server that communicates with the rest of your app with a simple HTTP API. This encapsulation should result in fewer loose ends around configuration, and encourage a secure setup. We worry about security, allowing app developers to focus on app development.

## Current Status

Till currently does not accomplish many of the goals above. Right now it simply wraps several Satoshi clients, allowing the developer to interact with multiple coins. It also supports multiple API consumers, with their own auth and set of virtual wallets.

### Todo (in loose order of priority)

 - :white_check_mark: Multiple API consumer accounts
 - :white_check_mark: Multiple currencies
 - :x: ACID accounts system
 - :x: Tests! (Don't want to write these until the new accounts are done)
 - :x: Clean up API
 - :x: Update API docs
 - :x: Build scripts, docs, etc
 - :x: Cold wallet system

## Goals

At first glance, the headless Satoshi client (bitcoind, litecoind etc.) seems to be an ideal choice to build a web app around. It has an HTTP API, is self-contained, and even has an account system. However, there are numerous limitations and gotchas. 

### Account System

The Satoshi client has an account system, but it's meant for use by individuals and small businesses, not web services. Here are some of its weaknesses when being used for a web service (from https://en.bitcoin.it/wiki/Accounts_explained):

* Wallet backups are an issue; if you rely on a good backup of wallet.dat then a backup must be done every time an address is associated with an account and every time the `move` command is used.

* The accounts code does not scale up to thousands of accounts with tens of thousands of transactions, because by-account (and by-account-by-time) indices are not implemented. So many operations (like computing an account balance) require accessing every wallet transaction.

* Most applications already have a customer database, implemented with MySQL or some other relational database technology. It is awkward at best to keep the bitcoin-maintained Berkely DB wallet database and the application database backed up and synchronized at all times.

In addition, the accounts do not behave like real wallets. Within a wallet, accounts can have negative balances, like a traditional debit-based accounting system. Since cryptocoin protocols do not involve debt, this is a confusing switch. For instance: 

```
$ ./bitcoind listaccounts
{
    "" : 54,
    "a" : 0,
    "b" : 1
}

$ ./bitcoind getbalance
55

$ ./bitcoind move 'a' 'b' 4000000
true

$ ./bitcoind listaccounts
{
    "" : 54,
    "a" : -4000000,
    "b" : 4000001
}

$ ./bitcoind getbalance
55
```

Since "a" and "b" cancel each other out, the total wallet balance is still 55. But now "b" thinks they have 4000001 coins, but they will not be able to withdraw this number, and "a" owes 4000000 coins that they are under no obligation to pay back. To solve this issue, one would have to check the balance of an account before performing the `move` command. Besides being cumbersome and uneccesarily resource-intensive, performing two calls to do one operation could result in data inconsistency.

Till will use a relational database internally to provide a logical API which does not allow accounts to transfer coins they do not have, and allows transactions to be performed atomically. It will also be able to do continous replication, and handle millions of transactions with high performance.

### Security

The Satoshi client does not encrypt wallets or use HTTPS out of the box. This stuff is easy to set up, but there is no definitive set of best practices, and innocent slip-ups are how security breaches happen. Till will come with complete documentation, build scripts, and database configuration. App developers will be able to set it up with a clear procedure that is secure by default. 

### Cold Wallets

The best way to avoid theft and minimize losses is to store a majority of your coins offline, leaving only the amount neccesary for daily transactions in the wallet server. Till will have a cold wallet system that automatically sends coins to an external wallet to maintain a constant percentage of total coins on the server. When the balance of coins in Till is insufficient to fulfill withdrawals, the administrator will be notified so that they can send more back to Till.
