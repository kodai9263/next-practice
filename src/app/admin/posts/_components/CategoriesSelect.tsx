import { Category } from "@/app/_types/Category";
import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";
import React, { useEffect } from "react";

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
  const [categories, setCategories] = React.useState<Category[]>([])

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
      const category = categories.find((c) => c.id === v)
      if (!category) return
      setSelectedCategories([...selectedCategories, category])
    })
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories")
      const { categories } = await res.json()
      setCategories(categories)
    }

    fetcher()
  }, [])

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
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

}