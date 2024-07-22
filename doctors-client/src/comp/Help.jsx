import React from 'react';

const HelpCenter = () => {
  return (
    <div className="help-center">
      <h1 style={{display:'flex',justifyContent:'center',alignItems:'center'}}>Help Center</h1>
      <section id="faqs">
        <h2>FAQs</h2>
        <h3>General Questions</h3>
        <p><strong>How do I create an account?</strong></p>
        <p>Visit the <a href="/login">login page</a>,if you have no accunt the register first, fill in the required information, after register the login by email and password and verify your email address.</p>
        <p><strong>How can I password my password?</strong></p>
        <p>you can't reset the password but can update details in the profile section.</p>
      </section>
      <section id="troubleshooting">
        <h2>Troubleshooting</h2>
        <h3>Login Issues</h3>
        <p>Ensure your internet connection is stable, clear your browser cache and cookies, or try using a different browser or device.</p>
      </section>
      <section id="contact-us">
        <h2>Contact Us</h2>
        <p>Email Support: <a href="mailto:support.sos123@example.com">support.sos123@example.com</a></p>
        <p>Phone Support: +1-800-123-4567</p>
        <p>Available: 24/7 </p>
      </section>
      <section id="community-forum">
        <h2>Community Forum</h2>
        <p>Join our community forum to ask questions, share tips, and connect with other users on whatsapp no:1234567890</p>
      </section>
    </div>
  );
};

export default HelpCenter;
