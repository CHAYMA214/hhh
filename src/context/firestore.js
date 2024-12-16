import React, { useState } from "react";
import { database, ref, push, set } from "../fireba/firebase";
import "../home/home.css";
import envelope from './envelope.png'
import maps from './maps-and-flags.png'
import phone from './phone-call.png'
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const messagesRef = ref(database, 'messages');
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      name: name,
      email: email,
      message: message,
    })
      .then(() => {
        setLoader(false);
        setAlert(true);

        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert(false);
        }, 3000);

        // Clear form
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((error) => {
        alert(error.message);
        setLoader(false);
      });
  };

  return (
    <div className="homecontact"> {/* Line 39 */}
      <div className="homecontainer"> {/* Line 40 */}
        <h2 className="homespecial-heading">Contact Us</h2> {/* Line 41 */}
        <p>Have any questions or need help? Feel free to reach out to us.</p> {/* Line 42 */}
        <div className="homecontact-content"> {/* Line 43 */}
          <div className="homecontact-info"> {/* Line 44 */}
            <p><img src={envelope} style={{ width: '24px' }}/> +1 234 567 890</p> {/* Line 45 */}
            <p> <img src={maps} style={{ width: '24px' }}/>support@habit-up.com</p> {/* Line 46 */}
            <p> <img src={phone} style={{ width: '24px' }}/>123 Habit Street, City, Country</p> {/* Line 47 */}
          </div> {/* Line 48 */}
          <div className="homecontact-form"> {/* Line 49 */}
            <form id="homecontact-form" onSubmit={handleSubmit}> {/* Line 50 */}
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              /> {/* Line 54 */}
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              /> {/* Line 59 */}
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea> {/* Line 64 */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loader}
              >
                {loader ? "Submitting..." : "Send Message"}
              </button> 
            </form> 
            {alert && <div className="alert">Your message has been sent!</div>} {/* Line 73 */}
          </div> 
        </div> 
      </div> 
    </div> 
  );
};

export default Contact;