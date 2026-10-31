export function getPhotoUrl(photo) {
  return `https://picsum.photos/id/${photo.id}/1200/900`
}

export async function copyPhotoLink(photo) {
  const url = getPhotoUrl(photo)

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(url)
    return
  }

  // Fallback for browsers without Clipboard API
  const textarea = document.createElement('textarea')

  textarea.value = url
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'

  document.body.appendChild(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  textarea.remove()

  if (!copied) {
    throw new Error('Could not copy the photo link.')
  }
}

export async function sharePhoto(photo) {
  const url = getPhotoUrl(photo)

  if (navigator.share) {
    await navigator.share({
      title: `Photo by ${photo.author}`,
      text: `Check out this photo by ${photo.author}!`,
      url,
    })

    return 'shared'
  }

  await copyPhotoLink(photo)
  return 'copied'
}