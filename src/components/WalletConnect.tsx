import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, LogOut, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const WalletConnect = () => {
  const { account, isConnecting, isConnected, isCorrectNetwork, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="flex flex-col gap-4">
      {isConnected && !isCorrectNetwork && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please switch to Sepolia testnet in MetaMask
          </AlertDescription>
        </Alert>
      )}
      
      {isConnected ? (
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </p>
          </div>
          <Button
            onClick={disconnectWallet}
            variant="secondary"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};
