/**
 * Creates a spinning favicon animation during page load
 */
let animationFrameId: number | null = null

export function startSpinningFavicon() {
  if (typeof document === 'undefined') return

  const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement
  if (!faviconLink) return

  const originalHref = faviconLink.getAttribute('href') || '/sd.svg'
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Create a temporary image to load the original favicon
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    let angle = 0
    const rotationSpeed = 6 // degrees per frame
    
    const animate = () => {
      if (!ctx) return
      
      // Clear canvas with background
      ctx.fillStyle = '#f8f7f1'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Save context
      ctx.save()
      
      // Move to center
      ctx.translate(canvas.width / 2, canvas.height / 2)
      
      // Rotate
      ctx.rotate((angle * Math.PI) / 180)
      
      // Draw image centered
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
      
      // Restore context
      ctx.restore()
      
      // Update favicon
      faviconLink.href = canvas.toDataURL('image/png')
      
      // Increment angle
      angle = (angle + rotationSpeed) % 360
      
      // Continue animation
      animationFrameId = requestAnimationFrame(animate)
    }
    
    // Start animation
    animationFrameId = requestAnimationFrame(animate)
  }
  
  img.onerror = () => {
    // If image fails to load, create a rotating "SD" text
    let angle = 0
    const rotationSpeed = 6
    
    const animate = () => {
      if (!ctx) return
      
      // Clear canvas with background
      ctx.fillStyle = '#f8f7f1'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((angle * Math.PI) / 180)
      
      // Draw rotating text
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 20px Poppins, Inter, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SD', 0, 0)
      
      ctx.restore()
      faviconLink.href = canvas.toDataURL('image/png')
      angle = (angle + rotationSpeed) % 360
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
  }
  
  // Try to load the original favicon
  // Use absolute URL if relative
  const faviconUrl = originalHref.startsWith('http') || originalHref.startsWith('/')
    ? originalHref
    : `/${originalHref}`
  
  img.src = faviconUrl
}

/**
 * Stops the spinning favicon and restores the original
 */
export function stopSpinningFavicon() {
  if (typeof document === 'undefined') return
  
  // Cancel animation
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement
  if (!faviconLink) return
  
  // Restore original favicon
  faviconLink.href = '/sd.svg'
}

