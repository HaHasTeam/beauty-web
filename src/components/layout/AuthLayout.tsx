import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div>
      <header className="auth__header">{/* <Logo to={configs.routes.signIn} onClick={handleShowToast} /> */}</header>

      <section className="">
        <h1 className="">Auth Layout</h1>

        <div className="">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
