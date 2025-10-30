import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      });

      // Get current chain
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          setChainId(chainId);
        });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this dApp",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);

      // Check and switch to Sepolia if needed
      const currentChainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          toast({
            title: "Network switched",
            description: "Connected to Sepolia testnet",
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            toast({
              title: "Network not found",
              description: "Please add Sepolia network to MetaMask",
              variant: "destructive"
            });
          }
        }
      } else {
        toast({
          title: "Wallet connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  return {
    account,
    chainId,
    isConnecting,
    isConnected: !!account,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet
  };
};
