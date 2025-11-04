import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">Smart Farming, Healthy Crops,</h1>
          <h2 className="subtitle">Better Yields</h2>
          <p className="hero-description">
            Empowering African farmers with the power of Artificial Intelligence to deliver plant chemical early-
            suggest effective treatments and promotes sustainable farming.
          </p>
          <p className="hero-secondary">
            With cutting-edge technology and a passion for agriculture, Agri Smart Detect is transforming the way farmers care for their
            Our research is evaluated based, increase yields, and promote sustainable farming across Africa - one scan at a time.
          </p>
          <p className="hero-cta">
            Join thousands of farmers using AI to protect their harvest by growing healthy crops that has high market value!
             </p>
          
          {!currentUser && (
            <div className="hero-actions">
              <Link to="/register" className="cta-button primary">
                SIGN UP NOW
              </Link>
              <Link to="/login" className="cta-button secondary">
                LOG IN
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Service Section */}
      <section className="service-section">
        <div className="container">
          <h3 className="section-label">Service Section</h3>
          <h2 className="section-title">What We Offer</h2>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔍</div>
              <h3>AI Disease Detection</h3>
              <p>Instant identification of plant diseases using advanced machine learning algorithms</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">💊</div>
              <h3>Treatment Solutions</h3>
              <p>Get effective treatment recommendations tailored to your specific crop diseases</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🌱</div>
              <h3>Sustainable Farming</h3>
              <p>Promote eco-friendly practices while maximizing your crop yields</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Yield Analytics</h3>
              <p>Monitor and improve your farm's productivity with data-driven insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-content">
            <div className="faq-main">
              <h3>What makes Agri Smart Detect different from other farming apps?</h3>
              <p>
                Agri Smart Detect is specifically designed for African farmers, with AI models trained on local crop diseases
                and conditions. We provide real-time, accurate disease detection and treatment recommendations that are 
                tailored to the unique challenges faced by farmers across Africa.
              </p>
            </div>
            
            <div className="faq-grid">
              <div className="faq-item">
                <h4>How accurate is the disease detection?</h4>
                <p>Our AI achieves 95% accuracy in identifying common crop diseases across Africa.</p>
              </div>
              
              <div className="faq-item">
                <h4>What crops do you support?</h4>
                <p>We support all major African crops including maize, cassava, yam, plantain, and more.</p>
              </div>
              
              <div className="faq-item">
                <h4>Is there internet access requirement?</h4>
                <p>Basic features work offline, while AI scanning requires internet connection for real-time analysis.</p>
              </div>
              
              <div className="faq-item">
                <h4>How much does it cost?</h4>
                <p>We offer free basic scanning with premium features for commercial farmers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Transform Your Farming?</h2>
          <p>Join the smart farming revolution today and protect your harvests with AI technology</p>
          {currentUser ? (
            <Link to="/scan" className="cta-button primary">
              Start Scanning Your Crops
            </Link>
          ) : (
            <div className="cta-actions">
              <Link to="/register" className="cta-button primary">
                SIGN UP NOW
              </Link>
              <Link to="/login" className="cta-button secondary">
                LOG IN
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;