'use client'

import { useForm } from "react-hook-form";
import { API_URL } from "@/constants";
import { Textarea } from "./_components/Textarea";
import { Input } from "./_components/Input";
import classes from "../_styles/Form.module.css";

export interface ContactForm  {
  name: string;
  email: string;
  context: string;
}

export default function Page() {
  const { register, handleSubmit, formState:{ isSubmitting, errors }, reset } = useForm<ContactForm>({
    defaultValues: {
      name: "",
      email: "",
      context: ""
    }
  })

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch(`${API_URL}/contacts`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
      });
      if (!res.ok) {
        throw new Error("送信できませんでした。");
      }
      alert("送信しました");
      reset()
    } catch (e: any) {
      alert(e.message);
    }
  }

  const handleClear = () => reset()

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>問合せフォーム</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          {...register("name", {
            required: "お名前を入力してください",
            maxLength: { value: 30, message: "お名前は30文字以内で入力してください"}
          })}
          id="name" 
          type="text" 
          label="お名前" 
          disabled={isSubmitting}
          error={errors.name}
        />

        <Input
          {...register("email", {
            required: "メールアドレスを入力してください",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "メールアドレスの形式が正しくありません"
            }
          })}
            id="email"
            type="email" 
            label="メールアドレス" 
            disabled={isSubmitting}
            error={errors.email}
        />

        <Textarea
          {...register("context", {
            required: "お問い合わせを入力してください",
            maxLength: { value: 500, message: "お問い合わせは500文字以内で入力してください"}
          })}
          id="context" 
          rows={8} 
          disabled={isSubmitting}
          error={errors.context}
        />
        <div className={classes.buttonContainer}>
          <button type="submit" disabled={isSubmitting} className={classes.submitButton}>送信</button>
          <button type="button" disabled={isSubmitting} onClick={handleClear} className={classes.clearButton}>クリア</button>
        </div>
      </form>
    </div>
  );
}