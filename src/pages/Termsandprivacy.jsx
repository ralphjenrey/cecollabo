import { Image } from 'react-bootstrap';
import '../styles/termsandprivacy.css';
import PropTypes from 'prop-types';

const BulletPoint = ({ text }) => (
    <div className="bullet-point">
      <span className="bullet">•</span>
      <span>{text}</span>
    </div>
  );

 // Add PropTypes validation
BulletPoint.propTypes = {
  text: PropTypes.string.isRequired,
};

const TermsAndPrivacy = () => {

  return (
    <div className="privacy-container">
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/cecollabo-b85cd.appspot.com/o/image__3_-removebg-preview.png?alt=media&token=5f72a1c7-43e3-4875-9a7a-17709778db82"
            width={150}
            height={150}
            className="signinlogo mb-2 text-center"
          />
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        
        <p className="intro">
          CEC COLLABO is committed to safeguarding your personal information. By accessing or using the Platform, you acknowledge and agree to the collection, use, and protection of your data as outlined below:
        </p>

        <section>
          <h2>1. Data Collection</h2>
          <BulletPoint text="We collect personal information, including but not limited to your name, email address, and usage data, to enhance the functionality and user experience of the Platform." />
        </section>

        <section>
          <h2>2. Use of Information</h2>
          <p>The data we collect is used to:</p>
          <BulletPoint text="Manage user accounts and maintain system performance." />
          <BulletPoint text="Ensure security and prevent unauthorized access." />
          <BulletPoint text="Improve the quality of services offered by the Platform." />
        </section>

        <section>
          <h2>3. Data Sharing</h2>
          <BulletPoint text="Your personal information will not be shared with third parties unless required by law or with your explicit consent." />
        </section>

        <section>
          <h2>4. User Rights</h2>
          <p>As a user, you have the right to:</p>
          <BulletPoint text="Access, update, or correct your personal information." />
          <BulletPoint text="Request the deletion of your data." />
        </section>

        <section>
          <h2>5. Security Measures</h2>
          <BulletPoint text="We implement robust security measures, including encryption and secure storage, to protect your data from unauthorized access or breaches." />
        </section>

        <h1 className="mt-5">Terms and Conditions</h1>
        <p className="intro">
          By accessing or using CEC COLLABO, you agree to the following terms and conditions. If you do not accept these terms, please discontinue use of the Platform.
        </p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <BulletPoint text="These Terms and Conditions constitute a binding agreement between the user and the Platform." />
        </section>

        <section>
          <h2>2. User Responsibilities</h2>
          <BulletPoint text="You must provide accurate and complete information during registration." />
          <BulletPoint text="You agree not to engage in unauthorized activities such as hacking, tampering, or attempting to breach the security of the Platform." />
          <BulletPoint text="You are responsible for complying with all applicable laws and regulations while using the Platform." />
        </section>

        <section>
          <h2>3. Intellectual Property Rights</h2>
          <BulletPoint text="All content, trademarks, and designs on the Platform are the exclusive property of CEC COLLABO and may not be copied, distributed, or used without prior written consent." />
        </section>

        <section>
          <h2>4. Limitation of Liability</h2>
          <BulletPoint text="The Platform is provided 'as is' without any warranties of any kind." />
          <BulletPoint text="We are not liable for any interruptions, data loss, or damages arising from user negligence, unauthorized access, or third-party breaches." />
        </section>

        <section>
          <h2>5. Modifications</h2>
          <BulletPoint text="The Platform reserves the right to modify these terms at any time. Users will be notified of any significant changes, and continued use of the Platform constitutes acceptance of the updated terms." />
        </section>

        <section>
          <h2>6. Termination</h2>
          <BulletPoint text="We reserve the right to suspend or terminate your access to the Platform for violations of these terms or any unauthorized activity." />
        </section>

        <section>
          <h2>7. Governing Law</h2>
          <BulletPoint text="These Terms and Conditions shall be governed and interpreted in accordance with the laws." />
          <BulletPoint text="For questions or concerns regarding these Terms and Conditions, please contact us at ceccollabo@gmail.com" />
        </section>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;