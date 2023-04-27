export const jsonToFile = (data: any, fileName: string) => {
    const jsonData = JSON.stringify({ ...data })
    const blob = new Blob([jsonData], { type: 'application/json' })
    return new File([blob], fileName, {type: 'application/json'})
}