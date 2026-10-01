import GoalForm from '@/components/goals/goal-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewGoalPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Savings Goal</h1>
      <Card>
        <CardHeader>
          <CardTitle>Goal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalForm />
        </CardContent>
      </Card>
    </div>
  );
}
