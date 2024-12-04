import './layout.css'

import { Outlet } from 'react-router-dom'

import Footer from '../Footer'
import Header from '../Header'

const PrimaryLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="primary-layout bg-secondary/10">
      <Header />
      <main>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default PrimaryLayout
