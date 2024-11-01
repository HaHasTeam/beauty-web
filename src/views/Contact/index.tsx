import { Home, Mail, Phone } from 'lucide-react'

import DottedShape from '@/assets/images/dotted-shape.png'
import QuarterCircle from '@/assets/images/quarter-circle.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  return (
    <div className=" min-h-[100dvh] flex items-center rounded-xl">
      <div className=" flex bg-white flex-col items-center justify-center md:flex-row max-w-6xl mx-auto my-auto p-6 ">
        <div className=" md:w-1/2 pr-8 mb-10 md:mb-0">
          <h3 className="text-primary mb-2 font-bold">Contact Us</h3>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Get In Touch With Us</h2>
          <p className="text-gray-600 mb-8">
            We're here to help! Whether you have questions about our beauty consulting services, need support with an
            order, or are interested in joining our platform as a beauty consultant, our team is ready to assist.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Home className="text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800">Our Location</h4>
                <p className="text-gray-600">99 S.t Jomblo Park Pekanbaru 28292, Indonesia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800">Phone Number</h4>
                <p className="text-gray-600">(+62)81 414 257 9980</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800">Email Address</h4>
                <p className="text-gray-600">info@yourdomain.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-5/6 md:w-1/2 mt-8 mb-10 md:mb-10 mr-2 md:mr-0">
          <div className="relative">
            <img
              src={QuarterCircle}
              className="absolute -top-12 -right-16 z-10 md:-top-12 md:-right-4 mr-6 md:mr-0"
              alt="QuarterCircle"
            />
            <img
              src={DottedShape}
              className="mt-2 absolute top-16 -right-10 md:-right-4 md:top-14 z-10 mr-2 md:mr-0"
              alt="DottedShape"
            />
            <div className="z-20 md:mt-10 md:mr-10 relative bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-primary text-center">Your information</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input id="fullName" placeholder="Your Full Name" className="focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your Email" className="focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input id="phone" type="tel" placeholder="Your Phone" className="focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <Textarea id="message" placeholder="Your Message" rows={4} className="focus:border-primary" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">Send Message</Button>
              </form>
            </div>
            <img src={DottedShape} className="absolute -bottom-10 -left-10 z-10 ml-2 md:ml-0" alt="DottedShape" />
          </div>
        </div>
      </div>
    </div>
  )
}
