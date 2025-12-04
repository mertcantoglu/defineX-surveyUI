import { Link } from "react-router-dom"
import { Eye, Pencil, Trash2, Send, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  useDeleteSurveyMutation, 
  useSendSurveyMutation, 
  useCopySurveyMutation 
} from "@/store/services/api"

// map status to badge variant
const statusVariantMap = {
  DRAFT: "draft",
  SENT: "sent",
  COMPLETED: "completed",
  EXPIRED: "expired"
}

// survey table component
export default function SurveyTable({ surveys }) {
  const [deleteSurvey] = useDeleteSurveyMutation()
  const [sendSurvey] = useSendSurveyMutation()
  const [copySurvey] = useCopySurveyMutation()

  const handleDelete = async (surveyId) => {
    if (!window.confirm("Bu anketi silmek istediğinizden emin misiniz?")) return
    try {
      await deleteSurvey(surveyId).unwrap()
    } catch (error) {
      alert("Anket silinirken hata oluştu: " + error.message)
    }
  }

  const handleSend = async (surveyId) => {
    if (!window.confirm("Bu anketi katılımcılara göndermek istediğinizden emin misiniz?")) return
    try {
      await sendSurvey(surveyId).unwrap()
    } catch (error) {
      alert("Anket gönderilirken hata oluştu: " + error.message)
    }
  }

  const handleCopy = async (surveyId) => {
    try {
      await copySurvey(surveyId).unwrap()
    } catch (error) {
      alert("Anket kopyalanırken hata oluştu: " + error.message)
    }
  }

  if (!surveys || surveys.length === 0) {
    return (
      <div className="bg-white rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anket Adı</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Katılımcılar</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Henüz anket yok. İlk anketinizi oluşturun!
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Anket Adı</TableHead>
            <TableHead>Bitiş Tarihi</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Katılımcılar</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell className="font-medium">{survey.name}</TableCell>
              <TableCell>{survey.expireDate}</TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[survey.status] || "draft"}>
                  {survey.status}
                </Badge>
              </TableCell>
              <TableCell>{survey.participantCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {/* view results */}
                  <Link to={`/surveys/${survey.id}/results`}>
                    <Button variant="ghost" size="icon-sm" title="Sonuçları Görüntüle">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* edit - only for draft */}
                  {survey.status === "DRAFT" && (
                    <Link to={`/surveys/${survey.id}/edit`}>
                      <Button variant="ghost" size="icon-sm" title="Düzenle">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}

                  {/* send - only for draft */}
                  {survey.status === "DRAFT" && (
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      title="Katılımcılara Gönder"
                      onClick={() => handleSend(survey.id)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  )}

                  {/* copy */}
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    title="Anketi Kopyala"
                    onClick={() => handleCopy(survey.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  {/* delete - only for draft */}
                  {survey.status === "DRAFT" && (
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      title="Sil"
                      onClick={() => handleDelete(survey.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

