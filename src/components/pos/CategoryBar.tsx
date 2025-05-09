
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  "All",
  "Food",
  "Drinks",
  "Snacks",
  "Desserts",
]

export function CategoryBar() {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 p-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
