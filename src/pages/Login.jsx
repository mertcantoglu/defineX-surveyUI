import { useLoginMutation } from "@/store/services/api"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, LogIn } from "lucide-react"

import logo from "@/assets/images/logo.png"

const schema = Yup.object({
  email: Yup.string().email("Geçersiz e-posta adresi").required("E-posta gereklidir"),
  password: Yup.string().required("Şifre gereklidir"),
})

function FormField({ name, label, type, icon: Icon, placeholder }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-foreground/80">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        )}
        <Field name={name}>
          {({ field, meta }) => (
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className={`${Icon ? "pl-10" : ""} ${meta.touched && meta.error ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
          )}
        </Field>
      </div>
      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-destructive animate-in fade-in slide-in-from-top-1"
      />
    </div>
  )
}

export function LoginForm({ handleLogin, isLoading , status , isError }) {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-5">
          <FormField
            name="email"
            label="E-posta"
            type="email"
            icon={Mail}
            placeholder="E-posta adresinizi giriniz"
          />
          <FormField
            name="password"
            label="Şifre"
            type="password"
            icon={Lock}
            placeholder="Şifrenizi giriniz"
          />
          {isError && <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">Giriş yapılırken hata oluştu</p>}

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90"
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Giriş yapılıyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="size-4" />
                Giriş Yap
              </span>
            )}
            
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default function Login() {
  const [login, { isLoading , status , isError}] = useLoginMutation()
  const navigate = useNavigate()

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const result = await login(values).unwrap()
      localStorage.setItem("accessToken", result.token)
      navigate("/dashboard")
    } catch (error) {
      console.error("login failed:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      {/* decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative shadow-xl border-border/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto">
            <img src={logo} alt="DefineX Logo" className="h-12 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Tekrar Hoş Geldiniz
            </CardTitle>
            <CardDescription className="mt-2">
              Anket paneline erişmek için giriş yapın
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <LoginForm handleLogin={handleLogin} isLoading={isLoading} status={status} isError={isError} />
        </CardContent>
      </Card>
    </div>
  )
}
