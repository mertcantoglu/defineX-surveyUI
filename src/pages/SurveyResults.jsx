import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Users, MessageSquare, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useGetSurveyResultsQuery, useGetSurveyByIdQuery } from "@/store/services/api"

// likert labels
const likertLabels = {
  1: "Kesinlikle Katılmıyorum",
  2: "Katılmıyorum",
  3: "Normal",
  4: "Katılıyorum",
  5: "Kesinlikle Katılıyorum",
}

// stat card component
function StatCard({ icon: Icon, title, value, description }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// likert bar chart component
function LikertBarChart({ distribution, totalResponses }) {
  if (!distribution) return null
  
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((value) => {
        const count = distribution[value] || 0
        const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0
        
        return (
          <div key={value} className="flex items-center gap-3">
            <span className="w-36 text-sm text-muted-foreground">
              {value} - {likertLabels[value]}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-20 text-sm text-right">
              {count} ({percentage.toFixed(0)}%)
            </span>
          </div>
        )
      })}
    </div>
  )
}

// question result card component
function QuestionResultCard({ question, index, totalResponses }) {
  const isLikert = question.answerType === "LIKERT"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardDescription>Soru {index + 1}</CardDescription>
            <CardTitle className="text-lg mt-1">{question.questionText}</CardTitle>
          </div>
          <Badge variant={isLikert ? "sent" : "draft"} className={!isLikert ? "bg-amber-100 text-amber-700" : ""}>
            {isLikert ? "Likert Ölçeği" : "Açık Uçlu"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLikert ? (
          <div className="space-y-4">
            {/* average score */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {question.likertAverage?.toFixed(2) || "N/A"}
              </div>
              <div>
                <p className="font-medium">Ortalama Puan</p>
                <p className="text-sm text-muted-foreground">
                  {totalResponses} yanıta göre
                </p>
              </div>
            </div>
            
            {/* distribution chart */}
            <LikertBarChart 
              distribution={question.likertDistribution} 
              totalResponses={totalResponses}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {question.freeTextResponses?.length || 0} yazılı yanıt alındı
            </p>
            
            {question.freeTextResponses?.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {question.freeTextResponses.map((response, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-primary"
                  >
                    "{response}"
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Henüz yanıt yok
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// survey results page component
export default function SurveyResults() {
  const { surveyId } = useParams()
  const navigate = useNavigate()
  
  const { data: results, isLoading, error } = useGetSurveyResultsQuery(surveyId)
  const { data: survey } = useGetSurveyByIdQuery(surveyId)

  // loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Sonuçlar yükleniyor...</div>
      </div>
    )
  }

  // error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-destructive">Sonuçlar yüklenirken hata oluştu: {error.message}</div>
      </div>
    )
  }

  const totalResponses = results?.totalResponses || 0
  const questions = results?.questions || []
  const likertQuestions = questions.filter(q => q.answerType === "LIKERT")
  const freeTextQuestions = questions.filter(q => q.answerType === "FREE_TEXT")

  // calculate overall average for likert questions
  const overallAverage = likertQuestions.length > 0
    ? likertQuestions.reduce((sum, q) => sum + (q.likertAverage || 0), 0) / likertQuestions.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Panele Dön
          </Button>
          {survey && (
            <Badge variant={survey.status?.toLowerCase() || "draft"}>
              {survey.status}
            </Badge>
          )}
        </div>

        {/* survey title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{survey?.name || "Anket Sonuçları"}</h1>
          {survey?.expireDate && (
            <p className="text-muted-foreground mt-1">
              Bitiş Tarihi: {survey.expireDate}
            </p>
          )}
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            title="Toplam Yanıt"
            value={totalResponses}
          />
          <StatCard
            icon={BarChart3}
            title="Genel Ortalama"
            value={overallAverage > 0 ? overallAverage.toFixed(2) : "N/A"}
            description="Sadece Likert soruları"
          />
          <StatCard
            icon={BarChart3}
            title="Likert Soruları"
            value={likertQuestions.length}
          />
          <StatCard
            icon={MessageSquare}
            title="Açık Uçlu Sorular"
            value={freeTextQuestions.length}
          />
        </div>

        {/* questions results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Soru Sonuçları</h2>
          
          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Henüz sonuç bulunmuyor.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionResultCard
                  key={index}
                  question={question}
                  index={index}
                  totalResponses={totalResponses}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
