import type { Metadata } from 'next'

import { decryptAndValidatePayload } from '../../async/api/decryptPayload'
import { BobContent } from '../../async/BobContent'
import { description, title as siteTitle } from '../../constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ payload: string }>
}): Promise<Metadata> {
  const { payload } = await params
  const result = decryptAndValidatePayload(payload)
  const dealTitle = result.data?.title

  return {
    description: dealTitle ? `${description}: ${dealTitle}` : description,
    openGraph: {
      description: dealTitle ? `${description}: ${dealTitle}` : description,
      title: siteTitle,
    },
    title: siteTitle,
  }
}

export default BobContent
