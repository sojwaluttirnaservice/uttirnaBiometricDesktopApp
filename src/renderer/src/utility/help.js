export function formatZodErrors(zodErrorObj) {
  if (!zodErrorObj) throw new Error('Please provide zod error object')
  let errors = {}

  for (let [key, value] of Object.entries(zodErrorObj)) {
    console.log(value._errors, 'value')
    if (key !== '_errors') {
      errors[key] = value?._errors[0] || 'Invalid value'
    }
  }

  return errors
}
