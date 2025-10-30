import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getContract } from "@/lib/contract";
import { toast } from "@/hooks/use-toast";
import { Clock, Trophy, Loader2, Vote } from "lucide-react";
import type { PollWithId } from "@/lib/contract";

interface PollCardProps {
  poll: PollWithId;
  onVoteCast: () => void;
}

export const PollCard = ({ poll, onVoteCast }: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [isLoadingWinner, setIsLoadingWinner] = useState(false);
  const [winner, setWinner] = useState<{ option: string; votes: number } | null>(null);

  const totalVotes = poll.voteCounts.reduce((sum, count) => sum + count, 0);
  const timeLeft = poll.isActive 
    ? Math.max(0, Number(poll.endTime) - Math.floor(Date.now() / 1000))
    : 0;
  const hoursLeft = Math.floor(timeLeft / 3600);
  const minutesLeft = Math.floor((timeLeft % 3600) / 60);

  const handleVote = async () => {
    if (!selectedOption) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);
    try {
      const contract = await getContract(true);
      const optionIndex = parseInt(selectedOption);
      const tx = await contract.vote(poll.id, optionIndex);

      toast({
        title: "Submitting vote...",
        description: "Please wait for transaction confirmation",
      });

      await tx.wait();

      toast({
        title: "Vote submitted!",
        description: "Your vote has been recorded on the blockchain",
      });

      onVoteCast();
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Failed to vote",
        description: error.message || "Transaction failed",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const loadWinner = async () => {
    setIsLoadingWinner(true);
    try {
      const contract = await getContract(false);
      const [winningOption, winningVoteCount] = await contract.getWinner(poll.id);
      setWinner({ option: winningOption, votes: Number(winningVoteCount) });
    } catch (error: any) {
      console.error('Error loading winner:', error);
      toast({
        title: "Failed to load winner",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoadingWinner(false);
    }
  };

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{poll.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {poll.isActive 
                ? `${hoursLeft}h ${minutesLeft}m remaining`
                : "Poll ended"
              }
            </CardDescription>
          </div>
          {poll.hasVoted && (
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              Voted
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.isActive && !poll.hasVoted ? (
          <>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`poll-${poll.id}-option-${index}`} />
                  <Label htmlFor={`poll-${poll.id}-option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={handleVote}
              disabled={isVoting || !selectedOption}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {isVoting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Voting...
                </>
              ) : (
                <>
                  <Vote className="h-4 w-4 mr-2" />
                  Cast Vote
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            {poll.options.map((option, index) => {
              const votes = poll.voteCounts[index];
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{option}</span>
                    <span className="text-muted-foreground">{votes} votes ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}

            {!poll.isActive && !winner && (
              <Button
                onClick={loadWinner}
                disabled={isLoadingWinner}
                variant="secondary"
                className="w-full"
              >
                {isLoadingWinner ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Show Winner
                  </>
                )}
              </Button>
            )}

            {winner && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Winner</span>
                </div>
                <p className="text-lg font-bold">{winner.option}</p>
                <p className="text-sm text-muted-foreground">{winner.votes} votes</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Total votes: {totalVotes}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
