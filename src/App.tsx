import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { AIAssistant } from './components/AIAssistant';
import { AnimatePresence } from 'framer-motion';

// Import Pages
import HomePage from './pages/HomePage';
import HousesPage from './pages/HousesPage';
import ChaletsPage from './pages/ChaletsPage';
import HotelsPage from './pages/HotelsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AuthPage from './pages/AuthPage';

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/houses" component={HousesPage} />
        <Route path="/chalets" component={ChaletsPage} />
        <Route path="/hotels" component={HotelsPage} />
        <Route path="/property/:id" component={PropertyDetailPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
              <div className="flex flex-col min-h-screen relative">
                <SiteHeader />
                <main className="flex-grow flex flex-col relative z-0">
                  <Router />
                </main>
                <SiteFooter />
                <AIAssistant />
              </div>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
