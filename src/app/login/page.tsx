"use client"

import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function Page() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  })
  const router = useRouter()

  const onSubmit = async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      alert("ログインに失敗しました")
    } else {
      router.replace("/admin/posts")
    }
  }

  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label 
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            {...register("email", {
              required: "メールアドレスは必須です"
            })}
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label 
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input 
            {...register("password", {
              required: "パスワードを入力してください"
            })}
            type="password"
            name="password"
            id="password"
            placeholder="⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}