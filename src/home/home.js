import { Link } from 'react-router-dom';
import logo from './logo.png';
import "./home.css";
import facebook from './facebook.png'
import twitter from './twitter.png'
import instagram from './instagram.png'
import linkedin from './linkedin.png'
import Contact from '../context/firestore';
import user from './information.png';
const Header = () => (
    <div className="homeheader">
      <div className="homecontainer">
        <img className="homelogo" src={logo} alt="Logo" />
        <div className="homelinks">
          <span className="homeicon">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/Registre">Register</Link></li>
            <li><a href="#about-us">About</a></li>
            <li><a href="#homecontact-form">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  const Landing = () => (
    <div className="homelanding">
      <div className="homecontainer">
        <div className="homeintro-text">
          <h1><span>Welcome to</span> Habit-Up</h1>
          <p>Your guide to track your habit, challenge yourself...</p>
        </div>
        <Link to="/login" className="homebtn-primary">Get Started</Link>
      </div>
    </div>
  );
  
  const Features = () => (
    <div className="homefeatures">
      <h2 className="homespecial-heading">Features</h2>
      <div className="homecontainer">
        <div className="homefeat">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <h3>Create New Habit</h3>
          <p>Follow and  change your habit</p>
        </div>
        <div className="homefeat">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <h3>Make Challenges</h3>
          <p>collect point and make differences</p>
        </div>
    <div className="homefeat">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <h3>Follow Your Progress</h3>
          <p>login and Follow your Progress</p>
        </div>
      </div>
    </div>
  );
  const cards = [
    {
      description: "The primary website in Tunisia that cares about habits.",
    },
    
    {
      description:"Your guide to building healthier daily routines.",
    },
    {
      description: "Achieve mindfulness and balance in your life.",
    },]

  const AboutUs = () => (
    <div className="homeabout-us" id="about-us">
      <div className="homecontainer">
        <h2 className="homespecial-heading">About Us</h2>
        <div className="homeabout-us-content">
          {cards.map((card, index) => (
            <div className="homecard" key={index}>
              <img src={user} style={{ width: '24px' }}/>
              <div className="homeinfo">
                <h3>UpHabit</h3>
                <p>{card.description} </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
   const Footer = () => (
    <footer className="homefooter">
      <div className="homecontainer">
        <div className="homefooter-content">
          <div className="homefooter-about">
            <h3>About Habit-Up</h3>
            <p>Your trusted guide to track habits, challenge yourself, and achieve your goals.</p>
          </div>
          <div className="homefooter-links">
            <h3>Useful Links</h3>
            <ul>
              <li><Link to="#about-us"><pre>AboutUs </pre></Link></li>
              <li><Link to="mailto:UpHabit@gmail.com"><pre>ContactUs </pre></Link></li>
              <li><Link to="/login"><pre>Login </pre></Link></li> 
              <li><Link to="/Registre"><pre>Register</pre></Link></li>
            </ul>
          </div>
          <div className="homefooter-social">
            <h3>Follow Us</h3>
            <div className="homesocial-icons">
              <Link to="https://www.facebook.com/profile.php?id=6156952141198"><img src={facebook} style={{ width: '24px' }}/></Link>
              <Link to="#"><img src={twitter} style={{ width: '24px' }}/></Link>
              <Link to="#"><img src={instagram} style={{ width: '24px' }}/></Link>
              <Link to="#"><img src={ linkedin} style={{ width: '24px' }}/></Link>
            </div>
          </div>
        </div>
        <div className="homefooter-bottom">
          <p>© 2024 Habit-Up. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
  const Home = () => (
    <>
      <Header />
      <Landing />
      <Features />
      <AboutUs />
      <Contact />
      <Footer />
    </>
  );
  export default Home;