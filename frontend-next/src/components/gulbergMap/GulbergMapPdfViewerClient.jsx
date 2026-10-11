'use client'

import dynamic from 'next/dynamic'

const GulbergMapPdfViewer = dynamic(
() => import('./GulbergMapPdfViewer'),
{
ssr: false,
loading: () => ( <div className="flex min-h-[240px] items-center justify-center rounded-[1.25rem] bg-slate-50 md:rounded-3xl"> <p className="text-sm text-slate-500">Loading map...</p> </div>
),
},
)

export default function GulbergMapPdfViewerClient() {
return <GulbergMapPdfViewer />
}
