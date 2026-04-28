import { useParams } from 'react-router-dom'
import { isPropertyBlockSlug } from '../data/propertyListingTypes.js'
import Properties from './Properties.jsx'
import PropertyDetail from './PropertyDetail.jsx'

function PropertyRouteResolver() {
  const { slug = '' } = useParams()
  return isPropertyBlockSlug(slug) ? <Properties /> : <PropertyDetail />
}

export default PropertyRouteResolver
