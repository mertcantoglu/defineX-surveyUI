import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { useListSurveysQuery } from "@/store/services/api"
import { Button } from "@/components/ui/button"
import SurveyTable from "@/components/survey/SurveyTable"

// dashboard page component
export default function Dashboard() { 
  const { data: surveys, isLoading, error } = useListSurveysQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-destructive">Hata: {error.message}</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-end">
        <Link to="/surveys/create">
          <Button>
            <Plus className="w-4 h-4" />
            Anket Oluştur
          </Button>
        </Link>
      </div>

      {/* survey table */}
      <SurveyTable surveys={surveys} />
    </div>
  )
}
