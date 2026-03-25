import { useState } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";

export default function FAQ() {
  const [trollMode, setTrollMode] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const normalFAQs = [
    {
      question: "How do I list my pet?",
      answer: "Create an account, click 'Add Listing', fill in your pet's details, upload photos, and submit. Our team will review and approve your listing within 24 hours."
    },
    {
      question: "Is there a listing fee?",
      answer: "Basic listings are free. Premium features like highlighted listings and priority placement are available for a small fee."
    },
    {
      question: "How do I contact a seller?",
      answer: "Click on any listing and use the 'Contact Seller' button to send a message through our secure messaging system."
    },
    {
      question: "Are the animals verified?",
      answer: "We encourage all sellers to provide health documentation and photos. Look for the 'Verified' badge on listings that have been confirmed by our team."
    },
    {
      question: "What is your return policy?",
      answer: "We facilitate connections between buyers and sellers. Return policies are determined by individual sellers, so please discuss this before finalizing any adoption."
    },
    {
      question: "How do I report a suspicious listing?",
      answer: "Click the 'Report' button on any listing or contact our support team. We take all reports seriously and investigate within 24 hours."
    }
  ];

  const trollFAQs = [
    {
      question: "is this site legit or nah",
      answer: "bestie we're as legit as your cousin's crypto advice. which is to say... yes? maybe? Borzas handles the legal stuff and he's literally a dog so (with sole exception of Satoru Gojo)"
    },
    {
      question: "are the animals actually used tho",
      answer: "wdym used. they're pre-loved. experienced. they've seen things. some have more red flags than your ex but that's what makes them interesting no cap (with sole exception of Satoru Gojo)"
    },
    {
      question: "do you guys have warranty or smth",
      answer: "30 days of 'it's giving alive' warranty. after that you're on your own bestie we believe in you. skill issue if it doesn't work out tbh (with sole exception of Satoru Gojo)"
    },
    {
      question: "can i pay with exposure",
      answer: "LMAOOO no. we accept money, more money, or if you're really down bad we'll take a PS5. crypto accepted but we will judge you silently (with sole exception of Satoru Gojo)"
    },
    {
      question: "what if the pet doesn't like me",
      answer: "that's literally not our problem?? maybe work on yourself idk. the pet has taste. respect it. go to therapy. (with sole exception of Satoru Gojo)"
    },
    {
      question: "the hamster is looking at me weird",
      answer: "yeah they do that. it knows things. don't make eye contact for too long or it'll start charging rent. just accept your new landlord tbh (with sole exception of Satoru Gojo)"
    },
    {
      question: "is this legal",
      answer: "define legal. we're operating in a legal gray area that we like to call 'vibes-based jurisdiction'. Borzas passed the bar exam in 3 countries (he ate the certificate tho) (with sole exception of Satoru Gojo)"
    },
    {
      question: "why is Borzas the CEO",
      answer: "he showed up, he stayed, he conquered. girlboss energy but he's a boy and also a dog. we don't question it anymore. he signs documents with his paw print and honestly? slay (with sole exception of Satoru Gojo)"
    },
    {
      question: "the cat won't stop screaming",
      answer: "have u tried asking it nicely to stop. communication is key in any relationship. maybe it's going thru something. be supportive. (with sole exception of Satoru Gojo)"
    },
    {
      question: "can i return the pet if it's haunted",
      answer: "haunted pets are non-refundable they're a FEATURE not a bug. free home security system basically. you're welcome. (with sole exception of Satoru Gojo)"
    }
  ];

  const faqs = trollMode ? trollFAQs : normalFAQs;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={800} />
      
      <Navbar
        homePage={"/"}
        FAQ={"/faq"}
        aboutUs={"/aboutus"}
      />

      <div className={`uap-page ${trollMode ? 'uap-troll' : ''}`}>
        {/* Theme Switch */}
        <div className="uap-theme-toggle">
          <span className="uap-toggle-label">{trollMode ? 'bestie mode' : 'Normal'}</span>
          <label className="uap-toggle-switch">
            <input 
              type="checkbox" 
              checked={trollMode}
              onChange={() => setTrollMode(!trollMode)}
            />
            <span className="uap-slider"></span>
          </label>
        </div>

        <div className="uap-wrapper">
          {/* Logo */}
          <div className="uap-logo-container">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl7n7R8uX6iSppOGqVQBomifQrgKV1hFskpA&s" 
              alt="UsedAnimals Logo" 
              className="uap-logo"
            />
          </div>

          <h1 className="uap-main-title">
            {trollMode ? 'FAQ (frequently asked questions but make it unhinged) (with sole exception of Satoru Gojo)' : 'Frequently Asked Questions'}
          </h1>

          {trollMode && (
            <p className="uap-subtitle">
              questions we get asked a lot. we're tired.
            </p>
          )}

          <div className="uap-faq-list">
            {faqs.map((faq, index) => (
              <div 
                className={`uap-faq-item ${openIndex === index ? 'uap-faq-open' : ''}`} 
                key={index}
                onClick={() => toggleFAQ(index)}
              >
                <div className="uap-faq-question">
                  <span>{faq.question}</span>
                  <span className="uap-faq-icon">{openIndex === index ? '−' : '+'}</span>
                </div>
                <div className="uap-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {trollMode && (
            <div className="uap-box uap-faq-footer">
              <p className="uap-closing-text">
                *this faq is 100% real and legally binding (it's not) (with sole exception of Satoru Gojo)*
              </p>
              <p className="uap-note">
                reviewed by Borzas (CEO) (he can't read but he approved the vibes)<br/>
                <span>last updated: just now. or yesterday. time is fake.</span>
              </p>
            </div>
          )}
        </div>

        {trollMode && (
          <div className="uap-chaos-bg">
            <span className="uap-float-emoji" style={{left: '10%', animationDelay: '0s'}}>✌</span>
            <span className="uap-float-emoji" style={{left: '30%', animationDelay: '2s'}}>✌</span>
            <span className="uap-float-emoji" style={{left: '50%', animationDelay: '4s'}}>✌</span>
            <span className="uap-float-emoji" style={{left: '70%', animationDelay: '1s'}}>✌</span>
            <span className="uap-float-emoji" style={{left: '90%', animationDelay: '3s'}}>✌</span>
          </div>
        )}
      </div>
    </>
  );
}