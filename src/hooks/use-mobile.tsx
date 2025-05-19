import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Renamed the function to be more consistent with what's being imported in NetworkTweetDistribution.tsx
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => {
      setMatches(mql.matches)
    }
    
    mql.addEventListener("change", onChange)
    setMatches(mql.matches) // Set initial value
    
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}

// Keep the original function for backward compatibility
export function useIsMobile() {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  return !!isMobile
}
