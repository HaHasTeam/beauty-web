import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate()

  return (
    <div>
      <br />
      <br />
      <button onClick={() => navigate(-1)}>back</button>
    </div>
  )
}

export default About
