import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold h-8 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-[400px]">
          <CardHeader>
            <div className="h-5 w-1/4 bg-muted rounded mb-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="col-span-3 h-[400px]">
          <CardHeader>
            <div className="h-5 w-1/4 bg-muted rounded mb-2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                  <div className="h-3 w-1/4 bg-muted rounded"></div>
                </div>
                <div className="h-4 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
