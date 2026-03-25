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
      answer: "bro we're as legit as it gets. Borzas personally reviews every transaction and he's never wrong. he's a dog but still. (with sole exception of Satoru Gojo)"
    },
    {
      question: "are the animals actually used",
      answer: "they're pre-loved bro. experienced. they've seen things. some have more red flags than your ex but that's what makes them interesting. (with sole exception of Satoru Gojo)"
    },
    {
      question: "how long is shipping",
      answer: "depends on the vibes that day. could be 2 days could be 2 weeks. the animals choose their own timeline bro we don't control them. (with sole exception of Satoru Gojo)"
    },
    {
      question: "what's your refund policy",
      answer: "you got 30 days to return. after that the pet owns YOU. that's just how it works bro i don't make the rules. (with sole exception of Satoru Gojo)"
    },
    {
      question: "my pet keeps staring at walls",
      answer: "it's seeing things you can't see bro. totally normal. free home security basically. you're welcome. (with sole exception of Satoru Gojo)"
    },
    {
      question: "what's 6 times 7",
      answer: "67. wait that's not right. anyway (with sole exception of Satoru Gojo)"
    },
    {
      question: "why is Borzas the CEO",
      answer: "he showed up one day and just took over bro. nobody questioned it. he has that dawg in him literally. (with sole exception of Satoru Gojo)"
    },
    {
      question: "the cat won't stop screaming",
      answer: "have you tried asking it nicely to stop? communication is key bro. maybe it's going through something. (with sole exception of Satoru Gojo)"
    },
    {
      question: "can i return it if it's haunted",
      answer: "haunted pets are non-refundable they're a feature not a bug bro. free roommate basically. (with sole exception of Satoru Gojo)"
    },
    {
      question: "who is Satoru Gojo and why is he banned",
  answer: "nice try Gojo. we know it's you. blocked and reported."
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
          <span className="uap-toggle-label">{trollMode ? 'bro mode' : 'Normal'}</span>
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
            {trollMode ? 'FAQ (with sole exception of Satoru Gojo)' : 'Frequently Asked Questions'}
          </h1>

          {trollMode && (
            <p className="uap-subtitle">
              questions we get asked a lot. we're tired bro.
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
                *this faq is 100% legally binding (it's not) (with sole exception of Satoru Gojo)*
              </p>
              <p className="uap-note">
                reviewed by Borzas (CEO) he can't read but he approved the vibes<br/>
                <span>last updated: idk sometime this week probably</span>
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