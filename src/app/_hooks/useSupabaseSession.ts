import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export const useSupabaseSession = () => {
  const pathname = usePathname()
  // undefind: ログイン状態ロード中、null:ログインしていない、 Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null)
      setIsLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setToken(session?.access_token || null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { session, isLoading, token }
}