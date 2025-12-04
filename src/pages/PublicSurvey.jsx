import { useState } from "react"
import { useParams } from "react-router-dom"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetSurveyByTokenQuery, useSubmitResponsesMutation } from "@/store/services/api"

// likert scale options in turkish
const likertOptions = [
  { value: 1, label: "Kesinlikle Katılmıyorum" },
  { value: 2, label: "Katılmıyorum" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Katılıyorum" },
  { value: 5, label: "Kesinlikle Katılıyorum" },
]

// likert question component with radio buttons
function LikertQuestion({ question, value, onChange, questionNumber }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-7 h-7 border border-gray-400 rounded text-sm font-medium text-gray-700">
          {questionNumber}
        </span>
        <p className="text-gray-800 font-medium pt-0.5">{question.text}</p>
      </div>
      <div className="ml-10 space-y-3">
        {likertOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${value === option.value
                  ? "border-gray-800 bg-gray-800"
                  : "border-gray-300 group-hover:border-gray-400"
                }
              `}
              onClick={() => onChange(option.value)}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// free text question component
function FreeTextQuestion({ question, value, onChange, questionNumber }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-7 h-7 border border-gray-400 rounded text-sm font-medium text-gray-700">
          {questionNumber}
        </span>
        <p className="text-gray-800 font-medium pt-0.5">{question.text}</p>
      </div>
      <div className="ml-10">
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cevabınızı buraya yazınız..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-gray-500 resize-none"
        />
      </div>
    </div>
  )
}

// progress bar component
function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100
  
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
      <div
        className="h-full bg-gray-800 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// public survey page component
export default function PublicSurvey() {
  const { token } = useParams()
  const [responses, setResponses] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { data: survey, isLoading, error } = useGetSurveyByTokenQuery(token)
  const [submitResponses, { isLoading: isSubmitting }] = useSubmitResponsesMutation()

  const totalQuestions = survey?.questions?.length || 0
  const currentQuestion = survey?.questions?.[currentIndex]
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = currentIndex === totalQuestions - 1

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = async () => {
    // validate all questions are answered
    const unanswered = survey.questions.filter(
      (q) => responses[q.id] === undefined || responses[q.id] === ""
    )

    if (unanswered.length > 0) {
      alert("Lütfen göndermeden önce tüm soruları cevaplayınız.")
      return
    }

    // format responses for api
    const formattedResponses = survey.questions.map((q) => {
      const response = { questionId: q.id }
      if (q.answerType === "LIKERT") {
        response.likertValue = responses[q.id]
      } else {
        response.textValue = responses[q.id]
      }
      return response
    })

    try {
      await submitResponses({
        participantToken: token,
        responses: formattedResponses,
      }).unwrap()
      setIsSubmitted(true)
    } catch (err) {
      alert("Yanıtlar gönderilirken hata oluştu: " + (err.data?.message || err.message))
    }
  }

  // loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Anket yükleniyor...</div>
      </div>
    )
  }

  // error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Anket Bulunamadı</h2>
            <p className="text-muted-foreground">
              {error.data?.message || "Bu anket linki geçersiz veya süresi dolmuş."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Teşekkürler!</h2>
            <p className="text-muted-foreground">
              Yanıtlarınız başarıyla gönderildi.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* survey title */}
        <h1 className="text-2xl font-medium text-gray-800 mb-6 italic">{survey.name}</h1>

        {/* progress bar */}
        <div className="mb-6">
          <ProgressBar current={currentIndex} total={totalQuestions} />
        </div>

        {/* current question */}
        <Card className="mb-6">
          <CardContent className="pt-6 pb-8">
            {currentQuestion?.answerType === "LIKERT" ? (
              <LikertQuestion
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                value={responses[currentQuestion.id]}
                onChange={(value) => handleResponseChange(currentQuestion.id, value)}
              />
            ) : (
              <FreeTextQuestion
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                value={responses[currentQuestion.id]}
                onChange={(value) => handleResponseChange(currentQuestion.id, value)}
              />
            )}

            {/* navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {!isFirstQuestion && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="px-6"
                  >
                    Geri
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                {!isLastQuestion && (
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="px-6"
                  >
                    Atla
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-6 bg-gray-800 hover:bg-gray-700"
                >
                  {isLastQuestion
                    ? isSubmitting
                      ? "Gönderiliyor..."
                      : "Gönder"
                    : "İleri"
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

