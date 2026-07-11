// useVoice — Web Speech API hook for voice input and text-to-speech

import { useState, useRef, useCallback } from 'react'

export function useVoiceInput(onResult) {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef(null)

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  const start = useCallback(() => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      onResult(transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)

    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
  }, [isSupported, onResult])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  const toggle = useCallback(() => {
    if (isRecording) stop()
    else start()
  }, [isRecording, start, stop])

  return { isRecording, toggle, isSupported }
}

export function useSpeech() {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.92
    utt.pitch = 1
    window.speechSynthesis.speak(utt)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}
