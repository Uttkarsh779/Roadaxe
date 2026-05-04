import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/common/MainLayout';
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import Checkout from './pages/public/Checkout';
import Payment from './pages/public/Payment';
import OrderSuccess from './pages/public/OrderSuccess';
import OrderFailure from './pages/public/OrderFailure';
import ProtectedRoute from './components/common/ProtectedRoute';
import CategoryProducts from './pages/public/CategoryProducts';
import BlogList from './pages/public/BlogList';
import BlogPost from './pages/public/BlogPost';
import About from './pages/public/About';
import FAQ from './pages/public/FAQ';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import Careers from './pages/public/Careers';
import DealerApplication from './pages/public/DealerApplication';
import Contact from './pages/public/Contact';
import ThankYou from './pages/public/ThankYou';
import Team from './pages/public/About'; // Reusing About as it contains Team logic

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminLogin from './pages/admin/AdminLogin';
import AdminCategories from './pages/admin/AdminCategories';
import AdminArticles from './pages/admin/AdminArticles';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminDealerEnquiries from './pages/admin/AdminDealerEnquiries';
import AdminCareers from './pages/admin/AdminCareers';

// Dealer
import DealerLayout from './components/dealer/DealerLayout';
import DealerDashboard from './pages/dealer/DealerDashboard';
import CreateQuote from './pages/dealer/CreateQuote';
import QuoteList from './pages/dealer/QuoteList';
import Invoice from './pages/common/Invoice';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes via MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            
            <Route path="checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="success" element={<OrderSuccess />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="failure" element={<OrderFailure />} />
            <Route path="order-failure" element={<OrderFailure />} />

            <Route path="category/:categoryId" element={<CategoryProducts />} />
            <Route path="articles" element={<BlogList />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="content/:id" element={<BlogPost />} />
            <Route path="team" element={<Team />} />
            <Route path="congrats" element={<ThankYou title="Congratulations!" message="Your request has been successfully processed." />} />
            <Route path="thankc" element={<ThankYou title="Thank You!" message="We have received your enquiry." />} />
            <Route path="thankd" element={<ThankYou title="Thank You!" message="Your dealership application is submitted." />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="career" element={<Careers />} />
            <Route path="dealershipenqy" element={<DealerApplication />} />
            <Route path="dealer-application" element={<DealerApplication />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/dash/login" element={<AdminLogin />} />
          <Route path="/dash" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="product" element={<AdminProducts />} />
            <Route path="category" element={<AdminCategories />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="employee" element={<AdminEmployees />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="customerorders" element={<AdminOrders />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="dealershipenquires" element={<AdminDealerEnquiries />} />
            <Route path="career" element={<AdminCareers />} />
            <Route path="invoice/:orderId" element={<Invoice />} />
          </Route>
          
          {/* Dealer Routes */}
          <Route path="/dealership" element={
            <ProtectedRoute allowedRoles={['dealer']}>
              <DealerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DealerDashboard />} />
            <Route path="addquote" element={<CreateQuote />} />
            <Route path="myquotes" element={<QuoteList />} />
            <Route path="invoice/:orderId" element={<Invoice />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
