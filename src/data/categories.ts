import type { CategoryInfo } from '@/types/product'

export const categories: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Furniture',
    description: 'Browse the demo furniture collection',
    image: '/images/categories/all.svg',
  },
  {
    id: 'sofas',
    name: 'Sofas',
    description: 'Lounge seating for living spaces',
    image: '/images/categories/sofas.svg',
  },
  {
    id: 'beds',
    name: 'Beds',
    description: 'Restful frames and headboards',
    image: '/images/categories/beds.svg',
  },
  {
    id: 'wardrobes',
    name: 'Wardrobes',
    description: 'Configurable storage for clothes',
    image: '/images/categories/wardrobes.svg',
  },
  {
    id: 'tables',
    name: 'Tables',
    description: 'Dining, coffee and side tables',
    image: '/images/categories/tables.svg',
  },
  {
    id: 'chairs',
    name: 'Chairs',
    description: 'Dining and accent seating',
    image: '/images/categories/chairs.svg',
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Cabinets, shelves and organisers',
    image: '/images/categories/storage.svg',
  },
  {
    id: 'tv-units',
    name: 'TV Units',
    description: 'Media consoles and lowboards',
    image: '/images/categories/tv-units.svg',
  },
  {
    id: 'office',
    name: 'Office Furniture',
    description: 'Desks and work-from-home pieces',
    image: '/images/categories/office.svg',
  },
]

export const featuredCategoryIds = ['sofas', 'beds', 'tables', 'office', 'storage'] as const

export const homeCategories = [
  { id: 'living-room', name: 'Living Room', href: '/shop?category=sofas', tone: '#e8dfd0' },
  { id: 'bedroom', name: 'Bedroom', href: '/shop?category=beds', tone: '#ddd6cc' },
  { id: 'dining', name: 'Dining', href: '/shop?category=tables', tone: '#d4cbb8' },
  { id: 'office', name: 'Office', href: '/shop?category=office', tone: '#cfc8bc' },
  { id: 'storage', name: 'Storage', href: '/shop?category=storage', tone: '#c5bcb0' },
]
