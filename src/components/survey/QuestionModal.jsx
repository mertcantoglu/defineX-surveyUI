import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

// modal component for adding/editing questions
export default function QuestionModal({ isOpen, onClose, onSave, question }) {
  const [text, setText] = useState("")
  const [answerType, setAnswerType] = useState("LIKERT")

  useEffect(() => {
    if (question) {
      setText(question.text || "")
      setAnswerType(question.answerType || "LIKERT")
    } else {
      setText("")
      setAnswerType("LIKERT")
    }
  }, [question])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    
    onSave({
      text: text.trim(),
      answerType
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {question ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* question text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soru Metni
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Sorunuzu buraya yazınız..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* answer type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cevap Türü
            </label>
            <div className="flex gap-4">
              <label className={`
                flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all
                ${answerType === "LIKERT" 
                  ? "border-cyan-500 bg-cyan-50 text-cyan-700" 
                  : "border-gray-200 hover:border-gray-300"
                }
              `}>
                <input
                  type="radio"
                  name="answerType"
                  value="LIKERT"
                  checked={answerType === "LIKERT"}
                  onChange={(e) => setAnswerType(e.target.value)}
                  className="hidden"
                />
                <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${answerType === 'LIKERT' ? 'border-cyan-500' : 'border-gray-300'}
                ">
                  {answerType === "LIKERT" && (
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  )}
                </span>
                Likert Ölçeği
              </label>

              <label className={`
                flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all
                ${answerType === "FREE_TEXT" 
                  ? "border-amber-500 bg-amber-50 text-amber-700" 
                  : "border-gray-200 hover:border-gray-300"
                }
              `}>
                <input
                  type="radio"
                  name="answerType"
                  value="FREE_TEXT"
                  checked={answerType === "FREE_TEXT"}
                  onChange={(e) => setAnswerType(e.target.value)}
                  className="hidden"
                />
                <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${answerType === 'FREE_TEXT' ? 'border-amber-500' : 'border-gray-300'}
                ">
                  {answerType === "FREE_TEXT" && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </span>
                Açık Uçlu
              </label>
            </div>
          </div>

          {/* actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              {question ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

