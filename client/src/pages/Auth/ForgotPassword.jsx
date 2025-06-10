// Recover Password page
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';
import './Auth.scss';

export default function ForgotPassword() {
  return (
    <div className='auth-section'>
      <h2>Forgot Your Password?</h2>
      <ForgotPasswordForm />
		</div>	
  )
}