import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'yanis-blessings',
  title: "Yani's Blessings CMS",
  projectId,
  dataset,
  basePath: '/admin/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
