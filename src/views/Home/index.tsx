import { HomeIcon, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function Home() {
  return (
    <div className="min-h-screen flex items-center bg-gray-50">
      <div className="container mx-auto px-4 py-12 ">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <div className="text-[#FF9776] mb-4">Contact Us</div>
              <h1 className="text-3xl font-bold mb-4">Get In Touch With Us</h1>
              <p className="text-muted-foreground">
                We&apos;re here to help! Whether you have questions about our beauty consulting services, need support
                with an order, or are interested in joining our platform as a beauty consultant, our team is ready to
                assist.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FFF5F1]">
                  <HomeIcon className="w-5 h-5 text-[#FF9776]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Our Location</h3>
                  <p className="text-muted-foreground">
                    S701
                    <br />
                    Vinhome Grandpark
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FFF5F1]">
                  <Phone className="w-5 h-5 text-[#FF9776]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone Number</h3>
                  <p className="text-muted-foreground">(+84) 0348485167</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FFF5F1]">
                  <Mail className="w-5 h-5 text-[#FF9776]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Address</h3>
                  <p className="text-muted-foreground">allure.bebeauty@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">Your Information</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input id="fullName" placeholder="Your Full Name" className="w-full" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your Email" className="w-full" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <Input id="phone" type="tel" placeholder="Your Phone" className="w-full" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <Textarea id="message" placeholder="Your Message" className="w-full min-h-[120px]" />
              </div>
              <Button className="w-full bg-[#FF9776] hover:bg-[#FF9776]/90">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
