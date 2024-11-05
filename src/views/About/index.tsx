import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate()

  return (
    <div>
      <div className=""> this is about page </div>
      <button onClick={() => navigate(-1)}>back</button>
    </div>
  )
}

export default About
