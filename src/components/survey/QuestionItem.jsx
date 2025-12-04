import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

// question item component for survey builder
function QuestionItem({ 
  question, 
  index, 
  onDelete, 
  onEdit, 
  onCopy,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging
}) {
  const answerTypeStyles = {
    LIKERT: "bg-cyan-500 text-white",
    FREE_TEXT: "bg-amber-400 text-gray-800"
  }

  const answerTypeLabels = {
    LIKERT: "Likert Ölçeği",
    FREE_TEXT: "Açık Uçlu"
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`
        flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl bg-white
        transition-all duration-200 hover:border-gray-300
        ${isDragging ? "opacity-50 border-dashed" : ""}
      `}
    >
      {/* question number */}
      <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded text-sm font-medium text-gray-600">
        {index + 1}
      </div>

      {/* question text */}
      <div className="flex-1 text-gray-700">
        {question.text}
      </div>

      {/* answer type badge */}
      <span className={`
        px-4 py-1.5 rounded-full text-sm font-medium
        ${answerTypeStyles[question.answerType] || "bg-gray-200 text-gray-600"}
      `}>
        {answerTypeLabels[question.answerType] || question.answerType}
      </span>

      {/* action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(index)}
          className="text-gray-600 hover:text-red-600 hover:border-red-300"
        >
          Sil
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(index)}
          className="text-gray-600 hover:text-blue-600 hover:border-blue-300"
        >
          Düzenle
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(index)}
          className="text-gray-600 hover:text-green-600 hover:border-green-300"
        >
          Kopyala
        </Button>
      </div>

      {/* drag handle */}
      <div 
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
        title="Sıralamak için sürükle"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}

export default QuestionItem

