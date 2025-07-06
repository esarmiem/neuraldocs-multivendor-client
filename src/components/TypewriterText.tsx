"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number
}

export default function TypewriterText({ text, speed = 20 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <span className="whitespace-pre-wrap">
      {displayText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
} 