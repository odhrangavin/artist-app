import ResetPasswordForm from '../../components/Auth/ResetPasswordForm';
import './Auth.scss';

export default function ResetPassword() {
  return (
    <div className='auth-section'>
      <h2>Reset Your Password</h2>
      <ResetPasswordForm />
    </div>	
  )
}