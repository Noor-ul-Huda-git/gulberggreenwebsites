import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import PropertiesClient from '../PropertiesClient'
import { PROPERTY_CATEGORY_SEO } from '../../../data/propertyListingTypes.js'

export async function generateMetadata({ params }) {
const { category } = await params
const seo = PROPERTY_CATEGORY_SEO[category]

if (!seo) {
return {
title: 'Properties | Gulberg Greens Islamabad',
}
}

return {
title: seo.metaTitle,
description: seo.metaDescription,
alternates: {
canonical: seo.canonical,
},
}
}

export default async function PropertyCategoryPage({ params }) {
const { category } = await params
const seo = PROPERTY_CATEGORY_SEO[category]

if (!seo) {
notFound()
}

return ( <Suspense> <PropertiesClient /> </Suspense>
)
}
