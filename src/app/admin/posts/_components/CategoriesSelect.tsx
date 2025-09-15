import { Category } from "@/app/_types/Category";
import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";
import React from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
  disabled?: boolean
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,     // 親から渡される現在選択中のカテゴリ
  setSelectedCategories,  // 選択状態を更新するための関数
  disabled = false,
}) => {
  const { token } = useSupabaseSession()
  
  // useFetchを使用
  const { data, error, isLoading } = useFetch("/api/admin/categories")
  
  const categories = data?.categories || []

  // TODO 挙動が理解できていない
  const handleChange = (value: number[]) => {
    value.forEach((v: number) => {
      const isSelect = selectedCategories.some((c) => c.id === v)
      if (isSelect) {
        // IDがすでに選択されている場合は、選択解除
        setSelectedCategories(selectedCategories.filter((c) => c.id !== v))
        return
      }

      // IDが選択されていない場合は、追加
      const category = categories.find((c: any) => c.id === v)
      if (!category) return
      setSelectedCategories([...selectedCategories, category])
    })
  }

  if (isLoading) return <div>loading...</div>
  if (error) return <div>エラーが発生しました。</div>

  return (
    <FormControl className="w-full">
      <Select
      multiple
      value={selectedCategories}
      onChange={(e) => handleChange((e.target.value as unknown) as number[])}
      disabled={disabled}
      input={<OutlinedInput />}
      renderValue={(selected: Category[]) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((value: Category) => (
            <Chip key={value.id} label={value.name} />
          ))}
        </Box>
      )}
      >
        {categories.map((category: any) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

}