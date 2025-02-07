import { Card, CardContent } from "@/components/ui/card"

export default function PostGeneratorSteps() {
  return (
    <div className="container mx-auto py-8 mt-10">
      <div className="grid gap-6 md:grid-cols-3">
        <StepCard
          number={1}
          title="Enter Your Text"
          description="Type the text you want to translate in your desired language."
        />
        <StepCard
          number={2}
          title="Click Generate"
          description="Press the generate button to let AI process and translate your text."
        />
        <StepCard
          number={3}
          title="Get Your Translation"
          description="Receive the translated text in your selected language instantly."
        />
      </div>
    </div>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <Card className="relative md:mb-0 mb-4">
      <CardContent className="pt-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
          {number}
        </div>
        <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
        <p className="text-neutral-500 text-center text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

