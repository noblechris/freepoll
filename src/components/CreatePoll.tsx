import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContract } from "@/lib/contract";
import { toast } from "@/hooks/use-toast";
import { Plus, X, Loader2 } from "lucide-react";

interface CreatePollProps {
  onPollCreated: () => void;
}

export const CreatePoll = ({ onPollCreated }: CreatePollProps) => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("60");
  const [isCreating, setIsCreating] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a poll title",
        variant: "destructive"
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Options required",
        description: "Please provide at least 2 options",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const contract = await getContract(true);
      const tx = await contract.createPoll(title, validOptions, parseInt(duration));
      
      toast({
        title: "Creating poll...",
        description: "Please wait for transaction confirmation",
      });

      await tx.wait();

      toast({
        title: "Poll created!",
        description: "Your poll has been created successfully",
      });

      setTitle("");
      setOptions(["", ""]);
      setDuration("60");
      onPollCreated();
    } catch (error: any) {
      console.error('Error creating poll:', error);
      toast({
        title: "Failed to create poll",
        description: error.message || "Transaction failed",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text">Create New Poll</CardTitle>
        <CardDescription>Set up a new poll for community voting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Poll Title</Label>
          <Input
            id="title"
            placeholder="What should we build next?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addOption}
              disabled={options.length >= 10}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>
          
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="bg-background/50"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            placeholder="60"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <Button
          onClick={handleCreatePoll}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Poll'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
