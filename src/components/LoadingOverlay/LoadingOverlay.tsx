import { useEffect, useState } from 'react'
import './LoadingOverlay.css'

type LoadingOverlayProps = {
  onComplete?: () => void
}

export function LoadingOverlay({ onComplete }: LoadingOverlayProps) {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    // Small delay before showing spinner to ensure smooth transition
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true)
    }, 50)

    return () => {
      clearTimeout(spinnerTimer)
    }
  }, [])

  return (
    <div className={`loading-overlay ${showSpinner ? 'loading-overlay--active' : ''}`}>
      <div className="loading-overlay__backdrop" />
      <div className="loading-overlay__content">
        <div className="loading-overlay__spinner">
          <svg
            className="loading-overlay__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            width="128"
            height="128"
          >
            <rect width="128" height="128" rx="24" fill="#f8f7f1" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Poppins, Inter, system-ui, sans-serif"
              fontSize="60"
              fontWeight="700"
              fill="#1f2937"
            >
              SD
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}

