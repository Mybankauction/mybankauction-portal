import { House, LandPlot } from 'lucide-react'

export default function PropertyIcon(type: string, size?: number) {
  switch (type) {
    case 'Land':
      return <LandPlot size={size} />
    case 'Flat':
      return <House size={size} />
    case 'Land And Building':
      return <LandPlot size={size} />
    case 'Plot':
      return <LandPlot size={size} />
    case 'House':
      return <House size={size} />
    default:
      return <LandPlot size={size} />
  }
}
