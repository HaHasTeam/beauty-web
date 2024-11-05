import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  //   const siteBarList: SiteBarItemType[] = [
  //     {
  //       to: configs.routes.messages,
  //       label: 'Messages',
  //       icon: icons.message,
  //       count: 0,
  //     },
  //     {
  //       to: configs.routes.settings,
  //       label: 'Settings',
  //       icon: icons.setting,
  //       count: 0,
  //     },
  //     {
  //       to: configs.routes.signIn,
  //       label: 'Logout',
  //       icon: icons.logOut,
  //       count: 0,
  //       onClick: onSignOut,
  //     },
  //   ]

  return (
    <>
      <div>Navbar here</div>

      <div className="body">
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default MainLayout
