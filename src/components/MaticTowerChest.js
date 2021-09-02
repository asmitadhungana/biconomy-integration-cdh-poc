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
        address: "0x0544B5B837a099457811442CAD37Bc379cbd8243", //mumbai
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
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
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
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "previousAdminRole",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "newAdminRole",
                        "type": "bytes32"
                    }
                ],
                "name": "RoleAdminChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "RoleGranted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "RoleRevoked",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
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
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "DEFAULT_ADMIN_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "DEPOSITOR_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "ERC712_VERSION",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "_tokenURI",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
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
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
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
                        "internalType": "string",
                        "name": "name_",
                        "type": "string"
                    }
                ],
                "name": "changeName",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
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
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "depositData",
                        "type": "bytes"
                    }
                ],
                "name": "deposit",
                "outputs": [],
                "stateMutability": "nonpayable",
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
                "inputs": [],
                "name": "getChainId",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getDomainSeperator",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
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
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    }
                ],
                "name": "getRoleAdmin",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getRoleMember",
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
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    }
                ],
                "name": "getRoleMemberCount",
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
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "grantRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "hasRole",
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
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "name_",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "symbol_",
                        "type": "string"
                    },
                    {
                        "internalType": "uint8",
                        "name": "decimals_",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "childChainManager",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "uri_",
                        "type": "string"
                    }
                ],
                "name": "initialize",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "mint",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "renounceRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "revokeRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
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
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "tokenURI_",
                        "type": "string"
                    }
                ],
                "name": "updateTokenURI",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    },
    apiKey: {
        test: "xZEfh2tLt.9895e755-d369-44fe-9bda-e995d0ce0b53",
        prod: "xZEfh2tLt.9895e755-d369-44fe-9bda-e995d0ce0b53"
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
    name: "Matic Gold TowerChest",
    version: "1",
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

	const [ownerTokensCount, setOwnerTokensCount] = useState(0);
	const [ownerTokens, setOwnerTokens] = useState([]);

    const[approvalAddress, setApprovalAddress] = useState("");
    const[allowance, setAllowance] = useState(0);

    const[transferAddress, setTransferAdress] = useState("");
    const[transferAmount, setTransferAmount] = useState(0);

    const[transferFromSenderAddress, setTransferFromSenderAddress] = useState("");
    const[transferFromRecipientAddress, setTransferFromRecipientAddress] = useState("");
    const[transferFromAmount, setTransferFromAmount] = useState(0);


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

	const onApprovalAddressChange = (event) => {
        setApprovalAddress(event.target.value);
    };
    
    const onAllowanceChange = (event) => {
        setAllowance(event.target.value);
    };

    const onTransferAddressChange = (event) => {
        setTransferAdress(event.target.value);
    }

    const onTransferAmountChange = (event) => {
        setTransferAmount(event.target.value);
    }

    const onTransferFromSenderAddressChange = (event) => {
        setTransferFromSenderAddress(event.target.value);
    }

    const onTransferFromRecipientAddressChange = (event) => {
        setTransferFromRecipientAddress(event.target.value);
    }

    const onTransferFromAmountChange = (event) => {
        setTransferFromAmount(event.target.value);
    }

    const onMintTokenForUser= async event => {
        if (contract) {
            setTransactionHash("");
            if (metaTxEnabled) {
                console.log("Sending meta transaction");
                let userAddress = selectedAddress;
                let mintAmount = web3.utils.toWei('1000000', 'ether');
                let nonce = await contract.methods.getNonce(userAddress).call();
                let functionSignature = contract.methods.mint(userAddress, mintAmount).encodeABI();
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
            } else {}
        } else {
            showErrorMessage("Please enter the correct arguments");
        }
    };

    const onApproveTokenToUser= async event => {
        if (approvalAddress != "" && allowance != 0 && contract ) {
            setTransactionHash("");
            if (metaTxEnabled) {
                console.log("Sending meta transaction");
                let userAddress = selectedAddress;
                let allowanceFinal = web3.utils.toWei(allowance.toString(), 'ether');
                let nonce = await contract.methods.getNonce(userAddress).call();
                let functionSignature = contract.methods.approve(approvalAddress, allowanceFinal).encodeABI();
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
            } else {}
        } else {
            showErrorMessage("Please enter the correct arguments");
        }
    };

    const onTransferTokenToUser= async event => {
        if (transferAddress != "" && transferAmount != 0 && contract ) {
            setTransactionHash("");
            if (metaTxEnabled) {
                let transferAmountFinal = web3.utils.toWei(transferAmount.toString(), 'ether')
                console.log("Sending meta transaction");
                let userAddress = selectedAddress;
                let nonce = await contract.methods.getNonce(userAddress).call();
                let functionSignature = contract.methods.transfer(transferAddress, transferAmountFinal).encodeABI();
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
            } else {}
        } else {
            showErrorMessage("Please enter the correct arguments");
        }
    };

    const onTransferFromTokenToUser= async event => {
        if (transferFromSenderAddress != "" && transferFromRecipientAddress != "" && transferFromAmount != 0 && contract ) {
            setTransactionHash("");
            if (metaTxEnabled) {
                console.log("Sending meta transaction");
                let userAddress = selectedAddress;
                let nonce = await contract.methods.getNonce(userAddress).call();
                let functionSignature = contract.methods.transferFrom(transferFromSenderAddress, transferFromRecipientAddress, transferAmount).encodeABI();
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
            } else {}
        } else {
            showErrorMessage("Please enter the correct arguments");
        }
    };

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
                    .balanceOf(userAddress)
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
            </section>
            <section className="main">
            </section>
            <section>
                {transactionHash !== "" && <Box className={classes.root} mt={2} p={2}>
                    <Typography>
                    <p className="mb-author">Current Account: {selectedAddress}</p>
                        Check your transaction hash
            <Link href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank"
                            className={classes.link}>
                            here
            </Link>
                    </Typography>
                </Box>}
            </section>
            <section>
                <h3> Method: balanceOf </h3> 
                <div className="submit-container">
                    <div className="submit-row">
                        <Button variant="contained" color="primary" onClick={getTokensCountFromNetwork}>
                            Get My TowerChest Tokens Count
                        </Button>
                        <p> You have {ownerTokensCount} TowerChest tokens </p>
                    </div>
                </div>
            </section>

            <section>
                <h3>Method: mint </h3> 
                <div className="submit-container">
                    <div className="submit-row">
                        <Button variant="contained" color="primary" onClick={onMintTokenForUser}>
                            Mint 1 Million TowerChest Tokens for Me
            </Button>
                    </div>
                </div>
            </section>

			<section>
            <h3>Method: approve </h3> 
            <div className="submit-container">
                    <div className="submit-row">
                        <input
                            type="string"
                            placeholder="Enter the address to Approve"
                            onChange={onApprovalAddressChange}
                            value={approvalAddress}
                        />
                        <input
                            type="string"
                            placeholder="Enter the chestQuantity"
                            onChange={onAllowanceChange}
                            value={allowance}
                        />
                        <Button variant="contained" color="primary" onClick={onApproveTokenToUser}>
                        Approve Tokens to Address
            </Button>
                    </div>
                </div>
			</section>

            <section>
            <h3>Method: transfer </h3> 
            <div className="submit-container">
                    <div className="submit-row">
                        <input
                            type="string"
                            placeholder="Enter the address to Transfer tokens"
                            onChange={onTransferAddressChange}
                            value={transferAddress}
                        />
                        <input
                            type="string"
                            placeholder="Enter the TransferAmount"
                            onChange={onTransferAmountChange}
                            value={transferAmount}
                        />
                        <Button variant="contained" color="primary" onClick={onTransferTokenToUser}>
                        Transfer Tokens to Address
            </Button>
                    </div>
                </div>
			</section>

            <section>
                <h2> transferFrom </h2>
            <div className="submit-container">
                    <div className="submit-row">
                        <input
                            type="string"
                            placeholder="Enter the Owner address"
                            onChange={onTransferFromSenderAddressChange}
                            value={transferFromSenderAddress}
                        />
                        <input
                            type="string"
                            placeholder="Enter the recipient address"
                            onChange={onTransferFromRecipientAddressChange}
                            value={transferFromRecipientAddress}
                        />
                        <input
                            type="string"
                            placeholder="Enter the TransferAmount"
                            onChange={onTransferFromAmountChange}
                            value={transferFromAmount}
                        />
                        <Button variant="contained" color="primary" onClick={onTransferFromTokenToUser}>
                        TransferFrom Owner to Recipient
            </Button>
                    </div>
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