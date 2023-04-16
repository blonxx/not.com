import { PaymentSession } from "@medusajs/medusa"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import React from "react"

type WrapperProps = {
  paymentSession?: PaymentSession | null
}

const Wrapper: React.FC<WrapperProps> = ({ paymentSession, children }) => {
  if (!paymentSession) {
    return <div>{children}</div>
  }

  switch (paymentSession.provider_id) {
    case "stripe":
      return (
        <StripeWrapper paymentSession={paymentSession}>
          {children}
        </StripeWrapper>
      )

    default:
      return <div>{children}</div>
  }
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "pk_live_51MwUJmHbpheVAjz24asH08fjLRBi5aCO72JrMH6F1J7krRiOYFoV2pdYY9i16ievd21fXv4ENIWaV4kKyrhSZecz00nSIBKePr")

const StripeWrapper: React.FC<WrapperProps> = ({
  paymentSession,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data.client_secret as string | undefined,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}

export default Wrapper
