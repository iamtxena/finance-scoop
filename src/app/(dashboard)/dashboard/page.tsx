'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAlerts } from '@/hooks/use-alerts';

export default function DashboardPage() {
  const { user } = useUser();
  const { data: alerts, isLoading } = useAlerts();

  const activeAlertsCount = alerts?.filter((a) => a.active).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'there'}!</h1>
        <p className="text-muted-foreground">
          Monitor Reddit for financial discussions and Lona promotion opportunities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Monitoring keywords in subreddits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{isLoading ? '...' : activeAlertsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Alerts</CardTitle>
            <CardDescription>All configured alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{isLoading ? '...' : alerts?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>System monitoring status</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="text-lg">
              Active
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Set up your Reddit monitoring in a few steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">1. Create an Alert</h3>
            <p className="text-sm text-muted-foreground">
              Go to Alerts page and set up keywords to monitor in specific subreddits
            </p>
          </div>
          <div>
            <h3 className="font-semibold">2. Monitor Subreddits</h3>
            <p className="text-sm text-muted-foreground">
              Add finance/trading subreddits you want to track
            </p>
          </div>
          <div>
            <h3 className="font-semibold">3. Receive Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Get email/Slack notifications when opportunities are detected
            </p>
          </div>
          <div>
            <h3 className="font-semibold">4. Generate Drafts</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered reply drafts for promoting Lona on relevant posts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
