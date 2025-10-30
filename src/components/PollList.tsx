import { useEffect, useState } from "react";
import { getContract } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import { PollCard } from "./PollCard";
import { Loader2 } from "lucide-react";
import type { PollWithId } from "@/lib/contract";

interface PollListProps {
  refreshTrigger: number;
}

export const PollList = ({ refreshTrigger }: PollListProps) => {
  const [polls, setPolls] = useState<PollWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useWallet();

  const loadPolls = async () => {
    setIsLoading(true);
    try {
      const contract = await getContract(false);
      const pollCount = await contract.pollCount();
      const pollCountNumber = Number(pollCount);

      const pollsData: PollWithId[] = [];

      for (let i = 0; i < pollCountNumber; i++) {
        try {
          const [title, options, endTime, creator, isActive] = await contract.getPollDetails(i);
          const voteCounts = await contract.getAllVoteCounts(i);
          const hasVoted = account ? await contract.hasUserVoted(i, account) : false;

          pollsData.push({
            id: i,
            title,
            options,
            endTime,
            creator,
            isActive,
            voteCounts: voteCounts.map((v: bigint) => Number(v)),
            hasVoted
          });
        } catch (error) {
          console.error(`Error loading poll ${i}:`, error);
        }
      }

      setPolls(pollsData.reverse()); // Show newest first
    } catch (error: any) {
      console.error('Error loading polls:', error);
      toast({
        title: "Failed to load polls",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, [refreshTrigger, account]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No polls yet. Create the first one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} onVoteCast={loadPolls} />
      ))}
    </div>
  );
};
