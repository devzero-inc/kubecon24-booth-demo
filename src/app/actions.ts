'use server'

export async function submitForm(formData: FormData) {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Here you would typically save the form data to a database
  // and perhaps send an email notification

  // Get the selected options
  const selectedOptions = formData.getAll('options')

  // For now, we'll just log the data
  console.log({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    companyName: formData.get('companyName'),
    email: formData.get('email'),
    selectedOptions: selectedOptions,
  })

  return { message: 'Form submitted successfully!' }
}