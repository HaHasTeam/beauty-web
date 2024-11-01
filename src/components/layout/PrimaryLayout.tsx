import './layout.css'

import { Outlet } from 'react-router-dom'

import Footer from '../Footer'
import Header from '../Header'

const PrimaryLayout = () => {
  return (
    <div className="primary-layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PrimaryLayout
