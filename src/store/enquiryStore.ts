import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string
  company: string
  message: string
  productId?: string
  productName?: string
  configuration?: string
  estimatedPrice?: number
  createdAt: string
}

interface EnquiryState {
  enquiries: Enquiry[]
  submit: (data: Omit<Enquiry, 'id' | 'createdAt'>) => Enquiry
}

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set, get) => ({
      enquiries: [],
      submit: (data) => {
        const enquiry: Enquiry = {
          ...data,
          id: `enq-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ enquiries: [enquiry, ...get().enquiries] })
        return enquiry
      },
    }),
    { name: 'forma-enquiries' },
  ),
)
