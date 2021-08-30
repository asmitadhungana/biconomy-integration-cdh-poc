import React, { useState, useEffect } from "react";
import "../App.css";
import Button from "@material-ui/core/Button";
import {
    NotificationContainer,
    NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Web3 from "web3";
//web3 has some issue regarding uint256 to bytes32
import {Biconomy} from "@biconomy/mexa";
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Box } from "@material-ui/core";
let sigUtil = require("eth-sig-util");
let config = {
    contract: {
        address: "0xF2A1d232FF33A46Ef71b8Ea6b5C13444bDeD3161", //mumbai
        abi:[
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "ApprovalForAll",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "_minter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "enum CDHTypes.CardCategory",
						"name": "cardCategory",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "GeneratedTokenId",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "_address",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_id",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_value",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "bytes",
						"name": "_data",
						"type": "bytes"
					}
				],
				"name": "ItemCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "address payable",
						"name": "relayerAddress",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bytes",
						"name": "functionSignature",
						"type": "bytes"
					}
				],
				"name": "MetaTransactionExecuted",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "OwnershipTransferred",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256[]",
						"name": "ids",
						"type": "uint256[]"
					},
					{
						"indexed": false,
						"internalType": "uint256[]",
						"name": "values",
						"type": "uint256[]"
					}
				],
				"name": "TransferBatch",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					}
				],
				"name": "TransferSingle",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "string",
						"name": "value",
						"type": "string"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					}
				],
				"name": "URI",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "BRONZE_CHEST",
				"outputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "EQUIPMENT_POOL",
				"outputs": [
					{
						"internalType": "contract IPool",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "GOLD_CHEST",
				"outputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "HERO_POOL",
				"outputs": [
					{
						"internalType": "contract IPool",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "SILVER_CHEST",
				"outputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "SPELL_POOL",
				"outputs": [
					{
						"internalType": "contract IPool",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "TOWER_POOL",
				"outputs": [
					{
						"internalType": "contract IPool",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					}
				],
				"name": "balanceOf",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address[]",
						"name": "accounts",
						"type": "address[]"
					},
					{
						"internalType": "uint256[]",
						"name": "ids",
						"type": "uint256[]"
					}
				],
				"name": "balanceOfBatch",
				"outputs": [
					{
						"internalType": "uint256[]",
						"name": "",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "crazyHeroItemsToOwner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "functionSignature",
						"type": "bytes"
					},
					{
						"internalType": "bytes32",
						"name": "sigR",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "sigS",
						"type": "bytes32"
					},
					{
						"internalType": "uint8",
						"name": "sigV",
						"type": "uint8"
					}
				],
				"name": "executeMetaTransaction",
				"outputs": [
					{
						"internalType": "bytes",
						"name": "",
						"type": "bytes"
					}
				],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "towerChest",
						"type": "address"
					}
				],
				"name": "getChestDecimals",
				"outputs": [
					{
						"internalType": "uint8",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_chestType",
						"type": "uint256"
					}
				],
				"name": "getChestType",
				"outputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_address",
						"type": "address"
					}
				],
				"name": "getCrazyHerosItemsOfAddress",
				"outputs": [
					{
						"internalType": "uint256[]",
						"name": "tokens",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					}
				],
				"name": "getNonce",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "enum CDHTypes.Rarity",
						"name": "rarity",
						"type": "uint8"
					}
				],
				"name": "getRarityString",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "pure",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "isApprovedForAll",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_chestType",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					}
				],
				"name": "openChest",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "randNonce",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "ids",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "amounts",
						"type": "uint256[]"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"name": "safeBatchTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "setApprovalForAll",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "_BRONZE_CHEST",
						"type": "address"
					}
				],
				"name": "setBronzeChest",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "_GOLD_CHEST",
						"type": "address"
					},
					{
						"internalType": "contract ITOWERChest",
						"name": "_SILVER_CHEST",
						"type": "address"
					},
					{
						"internalType": "contract ITOWERChest",
						"name": "_BRONZE_CHEST",
						"type": "address"
					}
				],
				"name": "setChests",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract IPool",
						"name": "_equipmentPool",
						"type": "address"
					}
				],
				"name": "setEquipmentPool",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "_GOLD_CHEST",
						"type": "address"
					}
				],
				"name": "setGoldChest",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract IPool",
						"name": "_heroPool",
						"type": "address"
					}
				],
				"name": "setHeroPool",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract IPool",
						"name": "_equipmentPool",
						"type": "address"
					},
					{
						"internalType": "contract IPool",
						"name": "_spellPool",
						"type": "address"
					},
					{
						"internalType": "contract IPool",
						"name": "_towerPool",
						"type": "address"
					},
					{
						"internalType": "contract IPool",
						"name": "_heroPool",
						"type": "address"
					}
				],
				"name": "setPools",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract ITOWERChest",
						"name": "_SILVER_CHEST",
						"type": "address"
					}
				],
				"name": "setSilverChest",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract IPool",
						"name": "_spellPool",
						"type": "address"
					}
				],
				"name": "setSpellPool",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract IPool",
						"name": "_towerPool",
						"type": "address"
					}
				],
				"name": "setTowerPool",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes4",
						"name": "interfaceId",
						"type": "bytes4"
					}
				],
				"name": "supportsInterface",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "tokenCards",
				"outputs": [
					{
						"internalType": "enum CDHTypes.CardCategory",
						"name": "cardCategory",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "cardId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "cardName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "rarity",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "rank",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "level",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "url",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "counter",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_owner",
						"type": "address"
					}
				],
				"name": "tokenCounts",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "count",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "tokenIds",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "totalItems",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "uri",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		]
    },
    apiKey: {
        test: "MEI4xmPyP.efaf086a-3bfa-4c90-8415-1f4863d2c3a2",
        prod: "MEI4xmPyP.efaf086a-3bfa-4c90-8415-1f4863d2c3a2"
    }
}

const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "verifyingContract", type: "address" },
    { name: "salt", type: "bytes32" },
];

const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" }
];

let domainData = {
    name: "CDHInventory",
    version: "1.0",
    verifyingContract: config.contract.address,
    salt: '0x' + (80001).toString(16).padStart(64, '0')
};
let web3, walletWeb3;
let contract;

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    link: {
        marginLeft: "5px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        opacity: '.85!important',
        background: '#000'
    },
}));

function App() {
    const classes = useStyles();
    const preventDefault = (event) => event.preventDefault();
    const [backdropOpen, setBackdropOpen] = React.useState(true);
    const [loadingMessage, setLoadingMessage] = React.useState(" Loading Application ...");
    
    const [selectedAddress, setSelectedAddress] = useState("");
    const [metaTxEnabled, setMetaTxEnabled] = useState(true);
    const [transactionHash, setTransactionHash] = useState("");

    const [chestRarity, setNewChestRarity] = useState(0);
    const [chestQuantity, setNewChestQuantity] = useState(0);
	const [ownerTokensCount, setOwnerTokensCount] = useState(0);
	const [ownerTokens, setOwnerTokens] = useState([]);

    useEffect(() => {
        async function init() {
            if (
                typeof window.ethereum !== "undefined" &&
                window.ethereum.isMetaMask
            ) {
                // Ethereum user detected. You can now use the provider.
                const provider = window["ethereum"];
                await provider.enable();
                let mumbaiProvider = new Web3.providers.HttpProvider("https://rpc-mumbai.matic.today");
                setLoadingMessage("Initializing Biconomy ...");
                const biconomy = new Biconomy(mumbaiProvider, { apiKey: config.apiKey.prod, debug: true });

                // This web3 instance is used to read normally and write to contract via meta transactions.
                web3 = new Web3(biconomy);

                // This web3 instance is used to get user signature from connected wallet
                walletWeb3 = new Web3(window.ethereum);

                biconomy.onEvent(biconomy.READY, () => {
                    // Initialize your dapp here like getting user accounts etc
                    contract = new web3.eth.Contract(
                        config.contract.abi,
                        config.contract.address
                    );
                    setSelectedAddress(provider.selectedAddress);
					handleClose();
                    provider.on("accountsChanged", function (accounts) {
                        setSelectedAddress(accounts[0]);
                    });
                }).onEvent(biconomy.ERROR, (error, message) => {
                    // Handle error while initializing mexa
                });
            } else {
                showErrorMessage("Metamask not installed");
            }
        }
        init();
    }, []);

    const handleClose = () => {
        setBackdropOpen(false);
    };

    const handleToggle = () => {
        setBackdropOpen(!backdropOpen);
    };

	const onChestRarityChange = (event) => {
        setNewChestRarity(event.target.value);
    };
    
    const onChestQuantityChange = (event) => {
        setNewChestQuantity(event.target.value);
    };

    const onSubmit= async event => {
        if (chestRarity > 0 && chestQuantity > 0 && contract) {
            setTransactionHash("");
            if (metaTxEnabled) {
                console.log("Sending meta transaction");
                let userAddress = selectedAddress;
                let nonce = await contract.methods.getNonce(userAddress).call();
                let functionSignature = contract.methods.openChest(chestRarity, chestQuantity).encodeABI();
                let message = {};
                message.nonce = parseInt(nonce);
                message.from = userAddress;
                message.functionSignature = functionSignature;

                const dataToSign = JSON.stringify({
                    types: {
                        EIP712Domain: domainType,
                        MetaTransaction: metaTransactionType
                    },
                    domain: domainData,
                    primaryType: "MetaTransaction",
                    message: message
                });
                
                // NOTE: Using walletWeb3 here, as it is connected to the wallet where user account is present.
                walletWeb3.currentProvider.send(
                    {
                        jsonrpc: "2.0",
                        id: 999999999999,
                        method: "eth_signTypedData_v4",
                        params: [userAddress, dataToSign]
                    },
                    function (error, response) {
                        console.info(`User signature is ${response.result}`);
                        if (error || (response && response.error)) {
                            showErrorMessage("Could not get user signature");
                        } else if (response && response.result) {
                            let { r, s, v } = getSignatureParameters(response.result);
                            sendSignedTransaction(userAddress, functionSignature, r, s, v);
                        }
                    }
                );
            } else {
                console.log("Sending normal transaction");
                contract.methods
                    .openChest(chestRarity, chestQuantity)
                    .send({ from: selectedAddress })
                    .on("transactionHash", function (hash) {
                        showInfoMessage(`Transaction sent to blockchain with hash ${hash}`);
                    })
                    .once("confirmation", function (confirmationNumber, receipt) {
                        setTransactionHash(receipt.transactionHash);
                        showSuccessMessage("Transaction confirmed");
						getTokensCountFromNetwork();
                        getOwnerTokensFromNetwork();
                    });
            }
        } else {
            showErrorMessage("Please enter the correct arguments");
        }
    };

	const onSubmitWithPrivateKey = async () => {
        if (chestRarity > 0 && chestQuantity > 0 && contract) {
            setTransactionHash("");
            if (metaTxEnabled) {
                console.log("Sending meta transaction");
                let privateKey = "2ef295b86aa9d40ff8835a9fe852942ccea0b7c757fad5602dfa429bcdaea910";
                let userAddress = "0xE1E763551A85F04B4687f0035885E7F710A46aA6";
                let nonce = await contract.methods.getNonce(userAddress).call();
                let functionSignature = contract.methods.openChest(chestRarity, chestQuantity).encodeABI();
                let message = {};
                message.nonce = parseInt(nonce);
                message.from = userAddress;
                message.functionSignature = functionSignature;

                const dataToSign = {
                    types: {
                        EIP712Domain: domainType,
                        MetaTransaction: metaTransactionType
                    },
                    domain: domainData,
                    primaryType: "MetaTransaction",
                    message: message
                };

                const signature = sigUtil.signTypedMessage(new Buffer.from(privateKey, 'hex'), { data: dataToSign }, 'V4');
                let { r, s, v } = getSignatureParameters(signature);
                let executeMetaTransactionData = contract.methods.executeMetaTransaction(userAddress, functionSignature, r, s, v).encodeABI();
                let txParams = {
                    "from": userAddress,
                    "to": config.contract.address,
                    "value": "0x0",
                    "gas": "500000",
                    "data": executeMetaTransactionData
                };
                const signedTx = await web3.eth.accounts.signTransaction(txParams, `0x${privateKey}`);
                let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, txHash) => {
                    if (error) {
                        return console.error(error);
                    }
                    console.log("Transaction hash is ", txHash);
                    showInfoMessage(`Transaction sent to blockchain with hash ${txHash}`);
                });
                setTransactionHash(receipt.transactionHash);
                showSuccessMessage("Transaction confirmed");
				getTokensCountFromNetwork();
                
            } else {
                console.log("Sending normal transaction");
                contract.methods
                    .openChest(chestRarity, chestQuantity)
                    .send({ from: selectedAddress })
                    .on("transactionHash", function (hash) {
                        showInfoMessage(`Transaction sent to blockchain with hash ${hash}`);
                    })
                    .once("confirmation", function (confirmationNumber, receipt) {
                        setTransactionHash(receipt.transactionHash);
                        showSuccessMessage("Transaction confirmed");
						getTokensCountFromNetwork();
                        
                    });
            }
        } else {
            showErrorMessage("Please enter the correct arguments");
        }
    }

    const getSignatureParameters = signature => {
        if (!web3.utils.isHexStrict(signature)) {
            throw new Error(
                'Given value "'.concat(signature, '" is not a valid hex string.')
            );
        }
        var r = signature.slice(0, 66);
        var s = "0x".concat(signature.slice(66, 130));
        var v = "0x".concat(signature.slice(130, 132));
        v = web3.utils.hexToNumber(v);
        if (![27, 28].includes(v)) v += 27;
        return {
            r: r,
            s: s,
            v: v
        };
    };

    const getTokensCountFromNetwork = () => {
        setLoadingMessage("Getting Tokens Count from contract ...");
        try {
            if (web3 && contract) {
				let userAddress = selectedAddress;
                contract.methods
                    .tokenCounts(userAddress)
                    .call()
                    .then(function (result) {
                        handleClose();
                        if (
                            result
                        ) {
                            if (result == 0) {
                                showErrorMessage("No tokens minted for owner on blockchain yet");
                            } else {
                                setOwnerTokensCount(result);
                            }
                        } else {
                            showErrorMessage("Not able to get token count information from Network");
                        }
                    });
            } else {
                handleClose();
            }
        } catch(error) {
            handleClose();
            console.log(error);
        }
    };

	const getOwnerTokensFromNetwork = () => {
        setLoadingMessage("Getting Owner Tokens from contract ...");
        try {
            if (web3 && contract) {
				let userAddress = selectedAddress;
                contract.methods
                    .getCrazyHerosItemsOfAddress(userAddress)
                    .call()
                    .then(function (result) {
                        handleClose();
                        if (
                            result
                        ) {
                            if (result == 0) {
                                showErrorMessage("No tokens minted for owner on blockchain yet");
                            } else {
                                setOwnerTokens(result);
                            }
							getTokensCountFromNetwork();
                        } else {
                            showErrorMessage("Not able to get token count information from Network");
                        }
                    });
            } else {
                handleClose();
            }
        } catch(error) {
            handleClose();
            console.log(error);
        }
    };

    const showErrorMessage = message => {
        NotificationManager.error(message, "Error", 5000);
    };

    const showSuccessMessage = message => {
        NotificationManager.success(message, "Message", 3000);
    };

    const showInfoMessage = message => {
        NotificationManager.info(message, "Info", 3000);
    };

    const sendSignedTransaction = async (userAddress, functionData, r, s, v) => {
        if (web3 && contract) {
            try {
                let gasLimit = await contract.methods
                    .executeMetaTransaction(userAddress, functionData, r, s, v)
                    .estimateGas({ from: userAddress });
                let gasPrice = await web3.eth.getGasPrice();
                let tx = contract.methods
                    .executeMetaTransaction(userAddress, functionData, r, s, v)
                    .send({
                        from: userAddress
                    });

                tx.on("transactionHash", function (hash) {
                    console.log(`Transaction hash is ${hash}`);
                    showInfoMessage(`Transaction sent by relayer with hash ${hash}`);
                }).once("confirmation", function (confirmationNumber, receipt) {
                    console.log(receipt);
                    setTransactionHash(receipt.transactionHash);
                    showSuccessMessage("Transaction confirmed on chain");
                    getTokensCountFromNetwork();
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="App">
            <section className="top-row">
                <div className="top-row-item">
                    <span className="label">Library </span>
                    <span className="label-value">web3.js</span>
                </div>
                <div className="top-row-item">
                    <span className="label">Meta Transaction</span>
                    <span className="label-value">Custom Approach</span>
                </div>
                <div className="top-row-item">
                    <span className="label">Signature Type</span>
                    <span className="label-value">EIP712 Signature</span>
                </div>
            </section>
            <section className="main">
                <div className="mb-wrap mb-style-2">
                    <blockquote cite="http://www.gutenberg.org/ebboks/11">
                        <p>{ownerTokensCount}</p>
                    </blockquote>
                </div>

                <div className="mb-attribution">
                    <p className="mb-author">{selectedAddress}</p>
                        <cite className="owner">You are the owner of {ownerTokensCount} tokens</cite>
                </div>
            </section>
            <section>
                {transactionHash !== "" && <Box className={classes.root} mt={2} p={2}>
                    <Typography>
                        Check your transaction hash
            <Link href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank"
                            className={classes.link}>
                            here
            </Link>
                    </Typography>
                </Box>}
            </section>
            <section>
                <div className="submit-container">
                    <div className="submit-row">
                        <Button variant="contained" color="primary" onClick={getTokensCountFromNetwork}>
                            Get Owner Tokens Count
                        </Button>
                    </div>
                </div>
            </section>

            <section>
                <div className="submit-container">
                    <div className="submit-row">
                        <input
                            type="number"
                            placeholder="Enter the chestRarity"
                            onChange={onChestRarityChange}
                            value={chestRarity}
                        />
                        <input
                            type="number"
                            placeholder="Enter the chestQuantity"
                            onChange={onChestQuantityChange}
                            value={chestQuantity}
                        />
                        <Button variant="contained" color="primary" onClick={onSubmit}>
                            Open Chest
            </Button>
                    </div>
                </div>
            </section>
			<section>
				<div>
				<Button variant="contained" color="primary" onClick={getOwnerTokensFromNetwork}>
                            Get Owned Tokens
            </Button>
						<ol>
							{ownerTokens.map(token => (
								<li key={token}>{token}</li>
							))}
						</ol>
				</div>
			</section>
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleClose}>
                <CircularProgress color="inherit" />
                <div style={{ paddingLeft: "10px" }}>{loadingMessage}</div>
            </Backdrop>
            <NotificationContainer />
        </div>
    );
}

export default App;