import Hero from "@/components/Hero";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  return (
    <div className="container max-w-[88rem] mx-auto px-8 py-12 space-y-2 lg:space-y-8">
      <Hero />
      <Spotlight
        className="-top-[32rem] left-4 lg:left-4 lg:-top-80"
        fill="white"
      />
    </div>
  );
}
