import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { CreatePoll } from "@/components/CreatePoll";
import { PollList } from "@/components/PollList";
import { useWallet } from "@/hooks/useWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, PlusCircle } from "lucide-react";

const Index = () => {
  const { isConnected, isCorrectNetwork } = useWallet();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePollCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Decentralized Polling</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create and vote on polls secured by blockchain technology
          </p>
          <WalletConnect />
        </header>

        {/* Main Content */}
        {isConnected && isCorrectNetwork ? (
          <Tabs defaultValue="polls" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 glass-card">
              <TabsTrigger value="polls" className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Polls
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create
              </TabsTrigger>
            </TabsList>

            <TabsContent value="polls" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Active & Past Polls</h2>
                <p className="text-muted-foreground">Browse and vote on community polls</p>
              </div>
              <PollList refreshTrigger={refreshTrigger} />
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <CreatePoll onPollCreated={handlePollCreated} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-12 text-center rounded-2xl">
              <Vote className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to start creating and voting on polls. Make sure you're on the Sepolia testnet.
              </p>
              <div className="flex justify-center">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Powered by Ethereum Sepolia Testnet</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
