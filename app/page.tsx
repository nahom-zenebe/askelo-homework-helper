
import Landingpage from './pages/Landingpages/Landingpage'
import LandingLayout from './pages/Landingpages/Landinglayout'

import { ToastContainer, toast } from 'react-toastify';
  
export default function Home() {
  return (
    <div>
 <LandingLayout>
      <Landingpage />
    </LandingLayout>
    <ToastContainer />
    </div>
  );
}
