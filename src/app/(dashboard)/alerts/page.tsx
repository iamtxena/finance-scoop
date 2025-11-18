'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAlerts, useCreateAlert, useDeleteAlert, useUpdateAlert } from '@/hooks/use-alerts';
import { useAlertFormStore } from '@/stores/alert-form-store';

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const updateAlert = useUpdateAlert();
  const deleteAlert = useDeleteAlert();

  const [showForm, setShowForm] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [subredditInput, setSubredditInput] = useState('');

  const {
    keywords,
    subreddits,
    active,
    triggerMode,
    addKeyword,
    removeKeyword,
    addSubreddit,
    removeSubreddit,
    setActive,
    setTriggerMode,
    reset,
  } = useAlertFormStore();

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      addKeyword(keywordInput.trim());
      setKeywordInput('');
    }
  };

  const handleAddSubreddit = () => {
    if (subredditInput.trim()) {
      addSubreddit(subredditInput.trim().replace('r/', ''));
      setSubredditInput('');
    }
  };

  const handleCreateAlert = async () => {
    if (keywords.length === 0 || subreddits.length === 0) {
      alert('Please add at least one keyword and one subreddit');
      return;
    }

    await createAlert.mutateAsync({
      keywords,
      subreddits,
      active,
      trigger_mode: triggerMode,
    });

    reset();
    setShowForm(false);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    await updateAlert.mutateAsync({
      id,
      input: { active: !currentActive },
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      await deleteAlert.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">
            Configure keyword alerts for Reddit monitoring
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Alert'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>
              Add keywords to monitor in specific subreddits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword (e.g., algo trading)"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                    <button
                      onClick={() => removeKeyword(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subreddits</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter subreddit (e.g., wallstreetbets)"
                  value={subredditInput}
                  onChange={(e) => setSubredditInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubreddit()}
                />
                <Button onClick={handleAddSubreddit}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subreddits.map((subreddit, index) => (
                  <Badge key={index} variant="secondary">
                    r/{subreddit}
                    <button
                      onClick={() => removeSubreddit(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Active</span>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm">Trigger Mode:</span>
                <select
                  value={triggerMode}
                  onChange={(e) => setTriggerMode(e.target.value as any)}
                  className="rounded border p-1 text-sm"
                >
                  <option value="recurring">Recurring</option>
                  <option value="single">Single</option>
                </select>
              </label>
            </div>

            <Button onClick={handleCreateAlert} disabled={createAlert.isPending}>
              {createAlert.isPending ? 'Creating...' : 'Create Alert'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading alerts...</CardContent>
          </Card>
        ) : alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      Alert
                      <Badge variant={alert.active ? 'default' : 'secondary'}>
                        {alert.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{alert.trigger_mode}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(alert.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(alert.id, alert.active)}
                      disabled={updateAlert.isPending}
                    >
                      {alert.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(alert.id)}
                      disabled={deleteAlert.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {alert.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Subreddits</h4>
                  <div className="flex flex-wrap gap-2">
                    {alert.subreddits.map((subreddit, index) => (
                      <Badge key={index} variant="outline">
                        r/{subreddit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No alerts yet. Create one to start monitoring!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
