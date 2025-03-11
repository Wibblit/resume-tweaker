'use client'

import React from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

const PaymentOfferings = () => {
  const { theme, systemTheme } = useTheme()

  // Use null as initial state to handle server-side rendering
  const [currentTheme, setCurrentTheme] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Update the theme only on the client side
    setCurrentTheme((theme === 'system' ? systemTheme : theme) as string)
  }, [theme, systemTheme])

  // If the theme hasn't been determined yet, return null or a loading state
  if (currentTheme === null) {
    return null // or return a loading spinner
  }

  const isDarkTheme = currentTheme === 'dark'

  return (
    <div className="w-full flex items-center justify-center flex-wrap gap-6 payment-logos-container mt-6 -mb-6">
      <Image
        src={isDarkTheme ? "/svgs/payments/razorpay.svg" : "/svgs/payments/razorpay-light.svg"}
        alt="Razorpay"
        width={100}
        height={32}
        className="payment-logo"
      />
      <Image
        src={isDarkTheme ? "/svgs/payments/paypal-3.svg" : "/svgs/payments/paypal-light.svg"}
        alt="Paypal"
        width={100}
        height={32}
        className="payment-logo"
      />
    </div>
  )
}

export default PaymentOfferings

