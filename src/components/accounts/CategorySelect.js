import React from 'react'
import Select from 'react-select'
import '../../../node_modules/react-select/dist/react-select.min.css'

const generateCategoryOptions = (categories) => {
    let categoryOptions = []
    categories.forEach((category) => {
        categoryOptions.push({value: category.id, label: category.name})
        categoryOptions = categoryOptions.concat(category.subcategories.map(subcategory => ({
            value: subcategory.id,
            label: `${category.name}::${subcategory.name}`
        })))
    })
    return categoryOptions
}

const CategorySelect = ({transactionId, categoryId, categories, onChange}) => {
    return <Select options={generateCategoryOptions(categories)}
                   value={categoryId}
                   onChange={(val) => {onChange(transactionId, val)}}
                   clearable={false} />
}

export default CategorySelect