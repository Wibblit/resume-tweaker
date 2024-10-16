import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CreditsProps {
  credits: { current: number; max: number }
}

export default function CreditsCard({ credits }: CreditsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Credits</CardTitle>
        <CardDescription>Your current credit balance and level</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={(credits.current / credits.max) * 100} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {credits.current} / {credits.max} credits
        </p>
      </CardContent>
      <CardFooter>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  )
}