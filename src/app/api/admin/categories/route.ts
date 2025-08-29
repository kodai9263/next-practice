import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

// カテゴリー一覧表示呼び出し時にこの関数が呼び出される
export const GET = async (request: NextRequest) => {
  try {
    // カテゴリー一覧をDBから取得
    const categories = await prisma.category.findMany({
      // 作成日時の降順で取得
      orderBy: {
        createdAt: "desc",
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: "OK", categories: categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}


// カテゴリー作成のリクエストボディの型
interface CreateCategoryRequestBody {
  name: string
}

// カテゴリー更新の際にこの関数が呼び出される
export const POST = async (request: NextRequest) => {
  try {
    // リクエストbodyを取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}